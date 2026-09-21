import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type ProceduralModelOptions = {
  wireframe?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  textureSize?: number;
  textureAnisotropy?: number;
  qualityPriority?: 'reference-fidelity' | 'balanced';
};

export type ProceduralModelRuntime = {
  nodes: Record<string, THREE.Object3D>;
  meshes: Record<string, THREE.Mesh>;
  sockets: Record<string, THREE.Object3D>;
  colliders: Record<string, unknown>;
  destructionGroups: Record<string, THREE.Object3D[]>;
};

type SculptMaterialSpec = Record<string, any>;

function hexToRgb(hex: string): [number, number, number] {
  const normalized = /^#[0-9a-f]{3}$/i.test(hex)
    ? '#' + hex.slice(1).split('').map((part) => part + part).join('')
    : hex;
  const value = /^#[0-9a-f]{6}$/i.test(normalized) ? Number.parseInt(normalized.slice(1), 16) : 0x8a7a5f;
  return [clampAlbedoChannel((value >> 16) & 255), clampAlbedoChannel((value >> 8) & 255), clampAlbedoChannel(value & 255)];
}

function materialPalette(spec: SculptMaterialSpec): string[] {
  const palette = spec.colorVariation?.palette;
  if (Array.isArray(palette) && palette.length > 0) return palette.filter((value) => typeof value === 'string');
  const secondary = spec.albedo?.secondary;
  const colors = [spec.baseColor ?? spec.color ?? spec.albedo?.dominant, ...(Array.isArray(secondary) ? secondary : [])];
  return colors.filter((value): value is string => typeof value === 'string' && value.startsWith('#'));
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function clampAlbedoChannel(value: number): number {
  return Math.max(30, Math.min(240, Math.round(value)));
}

function clampPbrF0(value: number): number {
  return Math.max(0.02, Math.min(1, value));
}

function clampPbrIor(value: number): number {
  return Math.max(1, Math.min(2.5, value));
}

function clampPbrMetalness(value: number): number {
  return value >= 0.5 ? 1 : 0;
}

function clampedAlbedoColor(spec: SculptMaterialSpec): THREE.Color {
  const source = typeof spec.baseColor === 'string' ? spec.baseColor : '#8A7A5F';
  return new THREE.Color().setStyle(source, THREE.SRGBColorSpace);
}

function smoothCurve(value: number): number {
  return value * value * (3 - 2 * value);
}

function periodicHash(x: number, y: number, seed: number, periodX: number, periodY: number): number {
  const wrappedX = ((x % periodX) + periodX) % periodX;
  const wrappedY = ((y % periodY) + periodY) % periodY;
  let value = Math.imul(wrappedX + seed * 17, 374761393) ^ Math.imul(wrappedY + seed * 31, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function periodicValueNoise(u: number, v: number, seed: number, periodX: number, periodY: number): number {
  const x = u * periodX;
  const y = v * periodY;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = smoothCurve(x - x0);
  const ty = smoothCurve(y - y0);
  const a = periodicHash(x0, y0, seed, periodX, periodY);
  const b = periodicHash(x0 + 1, y0, seed, periodX, periodY);
  const c = periodicHash(x0, y0 + 1, seed, periodX, periodY);
  const d = periodicHash(x0 + 1, y0 + 1, seed, periodX, periodY);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a, b, tx), THREE.MathUtils.lerp(c, d, tx), ty);
}

type SurfaceBand = {
  frequency: number;
  amplitude: number;
  stretchX: number;
  stretchY: number;
  ridge: boolean;
};

function surfaceBands(spec: SculptMaterialSpec): SurfaceBand[] {
  const source = Array.isArray(spec.surfaceFrequencyBands) ? spec.surfaceFrequencyBands : [];
  const parsed = source.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') return [];
    const band = item as Record<string, unknown>;
    const frequency = typeof band.frequency === 'number' ? band.frequency : 0;
    const amplitude = typeof band.amplitude === 'number' ? band.amplitude : 0;
    if (frequency <= 0 || amplitude <= 0) return [];
    const stretch = Array.isArray(band.stretch) ? band.stretch : [1, 1];
    const description = `${String(band.pattern ?? '')} ${String(band.role ?? '')}`.toLowerCase();
    return [{
      frequency,
      amplitude,
      stretchX: typeof stretch[0] === 'number' ? Math.max(0.1, stretch[0]) : 1,
      stretchY: typeof stretch[1] === 'number' ? Math.max(0.1, stretch[1]) : 1,
      ridge: /(ridge|groove|grain|fiber|striated|crack)/.test(description),
    }];
  });
  return parsed.length > 0 ? parsed : [
    { frequency: 2, amplitude: 0.42, stretchX: 1, stretchY: 1, ridge: false },
    { frequency: 12, amplitude: 0.22, stretchX: 1, stretchY: 1, ridge: false },
    { frequency: 56, amplitude: 0.08, stretchX: 1, stretchY: 1, ridge: false },
  ];
}

function sampleSurface(u: number, v: number, bands: SurfaceBand[], seed: number): number {
  let height = 0;
  for (const band of bands) {
    const sample = periodicValueNoise(u * band.stretchX, v * band.stretchY, seed, band.frequency, band.frequency);
    height += (sample - 0.5) * 2 * band.amplitude;
  }
  return height;
}

function makeAttachmentEndpoint(attachment: any) {
  if (!attachment || typeof attachment !== 'object') return null;
  const localStart = Array.isArray(attachment.localStart) ? attachment.localStart : [0, 0, 0];
  const localEnd = Array.isArray(attachment.localEnd) ? attachment.localEnd : [0, 1, 0];
  const start = new THREE.Vector3(...localStart);
  const end = new THREE.Vector3(...localEnd);
  const direction = end.clone().sub(start);
  const length = direction.length();
  if (length <= 1e-4) return null;
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  const baseRadius = Math.max(0.005, typeof attachment.baseRadius === 'number' ? attachment.baseRadius : 0.06);
  const endRadius = Math.max(0.003, typeof attachment.endRadius === 'number' ? attachment.endRadius : baseRadius * 0.55);
  return {
    start,
    midpoint: direction.clone().multiplyScalar(0.5).add(start),
    quaternion,
    length,
    baseRadius,
    endRadius,
  };
}

function buildTubeGeometry(params: { points: number[][]; radius: number; closed?: boolean }): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(
    params.points.map((p) => new THREE.Vector3(...p))
  );
  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, 64, Math.max(0.003, params.radius), 12, !!params.closed)
  );
}

function createSculptMaterial(id: string, spec: SculptMaterialSpec, options: ProceduralModelOptions): THREE.Material {
  const seed = options.qualityPriority === 'reference-fidelity' ? 42 : 7;
  const albedo = clampedAlbedoColor(spec);
  const roughnessBase = typeof spec.roughness === 'object' && spec.roughness
    ? typeof spec.roughness.base === 'number' ? spec.roughness.base : 0.5
    : 0.5;
  const roughnessVar = typeof spec.roughness === 'object' && spec.roughness
    ? typeof spec.roughness.variation === 'number' ? spec.roughness.variation : 0.1
    : 0.1;
  const metalnessBase = typeof spec.metalness === 'object' && spec.metalness
    ? typeof spec.metalness.base === 'number' ? spec.metalness.base : 0
    : 0;
  const metalnessVar = typeof spec.metalness === 'object' && spec.metalness
    ? typeof spec.metalness.variation === 'number' ? spec.metalness.variation : 0
    : 0;

  const clearcoat = spec.clearcoat ?? spec.shaderNotes?.some((note: string) => /clearcoat/i.test(note)) ? 0.15 : 0;
  const sheen = spec.sheen ?? 0;
  const transmission = spec.transmission ?? 0;

  const shaderModel = typeof spec.shaderModel === 'string' ? spec.shaderModel : 'MeshStandardMaterial';
  const usePhysical = /MeshPhysicalMaterial/.test(shaderModel) || clearcoat > 0 || sheen > 0 || transmission > 0;
  const material = usePhysical
    ? new THREE.MeshPhysicalMaterial({
        color: albedo,
        roughness: clamp01(roughnessBase),
        metalness: clampPbrMetalness(metalnessBase),
        clearcoat,
        clearcoatRoughness: 0.1,
        sheen,
        sheenRoughness: 0.3,
        transmission,
      })
    : new THREE.MeshStandardMaterial({
        color: albedo,
        roughness: clamp01(roughnessBase),
        metalness: clampPbrMetalness(metalnessBase),
      });

  material.color.setStyle((spec.baseColor ?? spec.color ?? '#8A7A5F') as string, THREE.SRGBColorSpace);
  if (usePhysical) {
    material.roughness = clamp01(roughnessBase + (Math.random() - 0.5) * roughnessVar);
    material.metalness = clampPbrMetalness(metalnessBase + (Math.random() - 0.5) * metalnessVar);
  }
  if (spec.doubleSided) material.side = THREE.DoubleSide;
  if (spec.name) material.name = spec.name;
  material.userData.sculptMaterial = spec;
  material.userData.proceduralMapsIndependent = true;
  material.userData.pbrConstraints = {
    albedoRange: [30, 240] as [number, number],
    binaryMetalness: true,
    f0Range: [0.02, 1] as [number, number],
    iorRange: [1, 2.5] as [number, number],
  };
  material.userData.pbrTextureSource = 'flat-fallback';
  material.userData.referencePbr = spec.referencePbr ?? null;
  material.userData.referenceMaterialId = spec.referenceMaterialId ?? spec.materialReference?.profileId ?? null;
  material.userData.materialEvidence = spec.materialEvidence ?? null;
  material.userData.validationViews = spec.materialReference?.validationViews ?? [];
  material.needsUpdate = true;
  return material;
}

function makeOvalShape(width: number, height: number): THREE.Shape {
  const shape = new THREE.Shape();
  const rx = width / 2;
  const ry = height / 2;
  shape.moveTo(rx, 0);
  shape.bezierCurveTo(rx, ry * 0.55, rx * 0.55, ry, 0, ry);
  shape.bezierCurveTo(-rx * 0.55, ry, -rx, ry * 0.55, -rx, 0);
  shape.bezierCurveTo(-rx, -ry * 0.55, -rx * 0.55, -ry, 0, -ry);
  shape.bezierCurveTo(rx * 0.55, -ry, rx, -ry * 0.55, rx, 0);
  return shape;
}

function makePizzaSliceShape(size: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, size * 0.6);
  shape.lineTo(size * 0.55, -size * 0.4);
  shape.quadraticCurveTo(size * 0.1, -size * 0.5, -size * 0.5, -size * 0.15);
  shape.lineTo(0, size * 0.6);
  return shape;
}

function makeGrillHalfShape(radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.absarc(0, 0, radius, Math.PI * 0.5, Math.PI * 1.5, false);
  shape.closePath();
  return shape;
}

function makeLeafShape(width: number, height: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, height * 0.5);
  shape.bezierCurveTo(width * 0.6, height * 0.2, width * 0.5, -height * 0.3, 0, -height * 0.5);
  shape.bezierCurveTo(-width * 0.5, -height * 0.3, -width * 0.6, height * 0.2, 0, height * 0.5);
  return shape;
}

function makeFlameShape(width: number, height: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, height * 0.5);
  shape.bezierCurveTo(width * 0.5, height * 0.2, width * 0.3, -height * 0.2, 0, -height * 0.5);
  shape.bezierCurveTo(-width * 0.3, -height * 0.2, -width * 0.5, height * 0.2, 0, height * 0.5);
  return shape;
}

function makeSwooshShape(width: number, height: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-width * 0.5, 0);
  shape.bezierCurveTo(-width * 0.2, height * 0.4, width * 0.2, -height * 0.2, width * 0.5, 0);
  shape.bezierCurveTo(width * 0.2, height * 0.15, -width * 0.2, -height * 0.1, -width * 0.5, 0);
  return shape;
}

function addHolesToPizza(shape: THREE.Shape, count: number, radius: number) {
  const positions: { x: number; y: number }[] = [];
  const ringRadius = radius * 0.55;
  const centerRing = radius * 0.25;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + 0.4;
    const r = i < 4 ? centerRing : ringRadius;
    positions.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r + radius * 0.05,
    });
  }
  positions.forEach((pos) => {
    const hole = new THREE.Path();
    const holeRadius = Math.max(0.015, radius * 0.12);
    hole.absarc(pos.x, pos.y, holeRadius, 0, Math.PI * 2, false);
    shape.holes.push(hole);
  });
}

function makeTextTexture(text: string, width: number, height: number, color: string, fontSize: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function extrudeShape(shape: THREE.Shape, depth: number, bevelEnabled: boolean, bevelThickness: number, bevelSize: number, bevelSegments: number): THREE.Mesh {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelSegments,
  });
  geometry.center();
  return new THREE.Mesh(geometry);
}

export function createSanjaLogoModel(options: ProceduralModelOptions = {}): THREE.Group {
  const root = new THREE.Group();
  root.name = 'Sanja Logo';
  root.userData.reconstructionEvidence = {
    itemFamily: null,
    subtype: null,
    componentAdapter: null,
    route: null,
    exactnessTier: null,
    referenceCamera: {
      solved: false,
      fovDegrees: 40,
      aspect: 1,
      orientation: { yaw: 0, pitch: 0, roll: 0 },
      positionHint: [0, 0, 3],
      note: 'For likeness work, solve the reference camera so the review render aligns with the photo and the reference can be projected.',
    },
    approximationNotes: ['Single-view 2D logo reconstruction with custom 3D extruded shapes.'],
  };
  root.userData.materialPipeline = {};
  root.userData.materialReferenceRegistry = null;

  const materialMap: Record<string, THREE.Material> = {};
  materialMap['brown-gloss'] = createSculptMaterial('brown-gloss', {
    id: 'brown-gloss',
    name: 'Brown Glossy',
    type: 'physical',
    shaderModel: 'MeshPhysicalMaterial / PBR approximation',
    baseColor: '#5C3317',
    color: '#5C3317',
    roughness: { base: 0.25, variation: 0.1 },
    metalness: { base: 0, variation: 0 },
    clearcoat: 0.1,
    doubleSided: true,
  }, options);
  materialMap['green-gloss'] = createSculptMaterial('green-gloss', {
    id: 'green-gloss',
    name: 'Green Glossy',
    type: 'physical',
    shaderModel: 'MeshPhysicalMaterial / PBR approximation',
    baseColor: '#2D8C00',
    color: '#2D8C00',
    roughness: { base: 0.2, variation: 0.1 },
    metalness: { base: 0, variation: 0 },
    clearcoat: 0.15,
    doubleSided: true,
  }, options);
  materialMap['pizza-slice-material'] = createSculptMaterial('pizza-slice-material', {
    id: 'pizza-slice-material',
    name: 'Pizza Slice',
    type: 'physical',
    shaderModel: 'MeshPhysicalMaterial / PBR approximation',
    baseColor: '#FFB700',
    color: '#FFB700',
    roughness: { base: 0.35, variation: 0.15 },
    metalness: { base: 0, variation: 0 },
    clearcoat: 0.05,
  }, options);
  materialMap['grill-half-material'] = createSculptMaterial('grill-half-material', {
    id: 'grill-half-material',
    name: 'Grill Half',
    type: 'physical',
    shaderModel: 'MeshPhysicalMaterial / PBR approximation',
    baseColor: '#1A0A00',
    color: '#1A0A00',
    roughness: { base: 0.5, variation: 0.2 },
    metalness: { base: 0, variation: 0 },
    clearcoat: 0.05,
  }, options);
  materialMap['flame-material'] = createSculptMaterial('flame-material', {
    id: 'flame-material',
    name: 'Flame',
    type: 'physical',
    shaderModel: 'MeshPhysicalMaterial / PBR approximation',
    baseColor: '#FF2200',
    color: '#FF2200',
    roughness: { base: 0.2, variation: 0.1 },
    metalness: { base: 0, variation: 0 },
    emissive: '#FF4400',
    emissiveIntensity: 0.8,
  }, options);
  materialMap['leaf-material'] = createSculptMaterial('leaf-material', {
    id: 'leaf-material',
    name: 'Leaf',
    type: 'physical',
    shaderModel: 'MeshPhysicalMaterial / PBR approximation',
    baseColor: '#6B8E23',
    color: '#6B8E23',
    roughness: { base: 0.4, variation: 0.15 },
    metalness: { base: 0, variation: 0 },
    clearcoat: 0.05,
  }, options);
  materialMap['background-white'] = new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.9,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  const nodes: Record<string, THREE.Object3D> = { root };
  const meshes: Record<string, THREE.Mesh> = {};
  const sockets: Record<string, THREE.Object3D> = {};
  const colliders: Record<string, unknown> = {};
  const destructionGroups: Record<string, THREE.Object3D[]> = {};

  const mainGroup = new THREE.Group();
  mainGroup.name = 'Sanja Logo__pivot';
  root.add(mainGroup);
  nodes['root'] = mainGroup;

  const ovalGroup = new THREE.Group();
  ovalGroup.name = 'Oval Frame__pivot';
  mainGroup.add(ovalGroup);
  nodes['oval-frame'] = ovalGroup;

  const ovalShape = makeOvalShape(1.9, 2.7);
  const ovalExtrudeSettings = { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 };
  const ovalGeometry = new THREE.ExtrudeGeometry(ovalShape, ovalExtrudeSettings);
  ovalGeometry.center();
  const ovalMesh = new THREE.Mesh(ovalGeometry, materialMap['brown-gloss']);
  ovalMesh.name = 'Oval Frame';
  ovalMesh.castShadow = true;
  ovalMesh.receiveShadow = true;
  ovalGroup.add(ovalMesh);
  meshes['oval-frame'] = ovalMesh;
  colliders['oval-frame'] = { type: 'box', offset: [0, 0, 0], scale: [1.05, 1.05, 1.1], isTrigger: false };
  destructionGroups['oval-frame'] = [ovalGroup];

  const iconGroup = new THREE.Group();
  iconGroup.name = 'Food Icon Assembly__pivot';
  iconGroup.position.set(0, 0.35, 0.02);
  mainGroup.add(iconGroup);
  nodes['icon-assembly'] = iconGroup;

  const pizzaShape = makePizzaSliceShape(0.7);
  addHolesToPizza(pizzaShape, 8, 0.7);
  const pizzaGeometry = new THREE.ExtrudeGeometry(pizzaShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 });
  pizzaGeometry.center();
  const pizzaMesh = new THREE.Mesh(pizzaGeometry, materialMap['pizza-slice-material']);
  pizzaMesh.name = 'Pizza Slice';
  pizzaMesh.position.set(-0.15, 0.15, 0.03);
  pizzaMesh.rotation.set(0, 0, -0.3);
  pizzaMesh.castShadow = true;
  pizzaMesh.receiveShadow = true;
  iconGroup.add(pizzaMesh);
  meshes['pizza-slice'] = pizzaMesh;
  colliders['pizza-slice'] = { type: 'box', offset: [0, 0, 0], scale: [1, 1, 1], isTrigger: false };

  const grillShape = makeGrillHalfShape(0.55);
  const grillGeometry = new THREE.ExtrudeGeometry(grillShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
  grillGeometry.center();
  const grillMesh = new THREE.Mesh(grillGeometry, materialMap['grill-half-material']);
  grillMesh.name = 'Grill Half';
  grillMesh.position.set(0.15, -0.15, 0.01);
  grillMesh.rotation.set(0, 0, 0.2);
  grillMesh.castShadow = true;
  grillMesh.receiveShadow = true;
  iconGroup.add(grillMesh);
  meshes['grill-half'] = grillMesh;
  colliders['grill-half'] = { type: 'box', offset: [0, 0, 0], scale: [1, 1, 1], isTrigger: false };

  const flameShape = makeFlameShape(0.25, 0.25);
  const flameGeometry = new THREE.ExtrudeGeometry(flameShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
  flameGeometry.center();
  const flameMesh = new THREE.Mesh(flameGeometry, materialMap['flame-material']);
  flameMesh.name = 'Flame';
  flameMesh.position.set(0, -0.35, 0);
  flameMesh.castShadow = true;
  flameMesh.receiveShadow = true;
  iconGroup.add(flameMesh);
  meshes['flame'] = flameMesh;
  colliders['flame'] = { type: 'box', offset: [0, 0, 0], scale: [1, 1, 1], isTrigger: false };

  const leafShape = makeLeafShape(0.25, 0.4);
  const leafGeometry = new THREE.ExtrudeGeometry(leafShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
  leafGeometry.center();
  const leafMesh = new THREE.Mesh(leafGeometry, materialMap['leaf-material']);
  leafMesh.name = 'Leaf';
  leafMesh.position.set(-0.25, 0.2, 0.02);
  leafMesh.rotation.set(0, 0, -0.5);
  leafMesh.castShadow = true;
  leafMesh.receiveShadow = true;
  iconGroup.add(leafMesh);
  meshes['leaf'] = leafMesh;
  colliders['leaf'] = { type: 'box', offset: [0, 0, 0], scale: [1, 1, 1], isTrigger: false };

  const greenArcsGroup = new THREE.Group();
  greenArcsGroup.name = 'Green Arcs__pivot';
  iconGroup.add(greenArcsGroup);
  nodes['green-arcs'] = greenArcsGroup;

  const arcCurve1 = new THREE.EllipseCurve(0, 0, 0.7, 0.9, Math.PI * 0.9, Math.PI * 1.7, false, 0);
  const arcPoints1 = arcCurve1.getPoints(64);
  const arcGeometry1 = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(arcPoints1.map(p => new THREE.Vector3(p.x, p.y, 0.02))),
    64, 0.025, 8, false
  );
  const arcMesh1 = new THREE.Mesh(arcGeometry1, materialMap['green-gloss']);
  arcMesh1.name = 'Green Arc 1';
  greenArcsGroup.add(arcMesh1);

  const sanjaTextGroup = new THREE.Group();
  sanjaTextGroup.name = 'SANJA Text__pivot';
  sanjaTextGroup.position.set(0, -0.1, 0.01);
  mainGroup.add(sanjaTextGroup);
  nodes['sanja-text'] = sanjaTextGroup;

  const sanjaCanvas = document.createElement('canvas');
  sanjaCanvas.width = 1024;
  sanjaCanvas.height = 256;
  const sanjaCtx = sanjaCanvas.getContext('2d')!;
  sanjaCtx.fillStyle = '#5C3317';
  sanjaCtx.font = 'bold 160px Arial, sans-serif';
  sanjaCtx.textAlign = 'center';
  sanjaCtx.textBaseline = 'middle';
  sanjaCtx.fillText('SANJA', 512, 128);
  const sanjaTexture = new THREE.CanvasTexture(sanjaCanvas);
  sanjaTexture.minFilter = THREE.LinearFilter;
  sanjaTexture.magFilter = THREE.LinearFilter;
  sanjaTexture.colorSpace = THREE.SRGBColorSpace;

  const sanjaPlaneGeometry = new THREE.PlaneGeometry(1.8, 0.45);
  const sanjaPlane = new THREE.Mesh(
    sanjaPlaneGeometry,
    new THREE.MeshStandardMaterial({ map: sanjaTexture, transparent: true, side: THREE.DoubleSide, roughness: 0.3, metalness: 0 })
  );
  sanjaPlane.name = 'SANJA Text Plane';
  sanjaTextGroup.add(sanjaPlane);
  meshes['sanja-text'] = sanjaPlane;
  colliders['sanja-text'] = { type: 'box', offset: [0, 0, 0], scale: [1, 1, 1], isTrigger: false };

  const dividerGeometry = new THREE.BoxGeometry(1.4, 0.04, 0.04);
  const dividerMesh = new THREE.Mesh(dividerGeometry, materialMap['brown-gloss']);
  dividerMesh.name = 'Horizontal Divider';
  dividerMesh.position.set(0, 0, 0.01);
  sanjaTextGroup.add(dividerMesh);
  meshes['horizontal-line'] = dividerMesh;
  colliders['horizontal-line'] = { type: 'box', offset: [0, 0, 0], scale: [1, 1, 1], isTrigger: false };

  const taglineGroup = new THREE.Group();
  taglineGroup.name = 'Tagline Text__pivot';
  taglineGroup.position.set(0, -0.6, 0.01);
  mainGroup.add(taglineGroup);
  nodes['tagline-text'] = taglineGroup;

  const taglineCanvas = document.createElement('canvas');
  taglineCanvas.width = 1024;
  taglineCanvas.height = 256;
  const taglineCtx = taglineCanvas.getContext('2d')!;
  taglineCtx.fillStyle = '#2D8C00';
  taglineCtx.font = 'bold 100px Arial, sans-serif';
  taglineCtx.textAlign = 'center';
  taglineCtx.textBaseline = 'middle';
  taglineCtx.fillText('PIZZARIA', 512, 90);
  taglineCtx.fillText('&', 512, 150);
  taglineCtx.fillText('HAMBURGUERIA', 512, 210);
  const taglineTexture = new THREE.CanvasTexture(taglineCanvas);
  taglineTexture.minFilter = THREE.LinearFilter;
  taglineTexture.magFilter = THREE.LinearFilter;
  taglineTexture.colorSpace = THREE.SRGBColorSpace;

  const taglinePlaneGeometry = new THREE.PlaneGeometry(1.8, 0.45);
  const taglinePlane = new THREE.Mesh(
    taglinePlaneGeometry,
    new THREE.MeshStandardMaterial({ map: taglineTexture, transparent: true, side: THREE.DoubleSide, roughness: 0.3, metalness: 0 })
  );
  taglinePlane.name = 'Tagline Text Plane';
  taglineGroup.add(taglinePlane);
  meshes['tagline-text'] = taglinePlane;
  colliders['tagline-text'] = { type: 'box', offset: [0, 0, 0], scale: [1, 1, 1], isTrigger: false };

  const swooshGroup = new THREE.Group();
  swooshGroup.name = 'Bottom Swoosh__pivot';
  swooshGroup.position.set(0, -1.05, 0);
  mainGroup.add(swooshGroup);
  nodes['bottom-swoosh'] = swooshGroup;

  const swooshShape = makeSwooshShape(1.1, 0.18);
  const swooshGeometry = new THREE.ExtrudeGeometry(swooshShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 });
  swooshGeometry.center();
  const swooshMesh = new THREE.Mesh(swooshGeometry, materialMap['green-gloss']);
  swooshMesh.name = 'Bottom Swoosh';
  swooshMesh.rotation.x = -0.2;
  swooshMesh.castShadow = true;
  swooshMesh.receiveShadow = true;
  swooshGroup.add(swooshMesh);
  meshes['bottom-swoosh'] = swooshMesh;
  colliders['bottom-swoosh'] = { type: 'box', offset: [0, 0, 0], scale: [1, 1, 1], isTrigger: false };

  const backgroundGroup = new THREE.Group();
  backgroundGroup.name = 'Background Plane__pivot';
  backgroundGroup.position.set(0, 0, -0.2);
  mainGroup.add(backgroundGroup);
  nodes['background-plane'] = backgroundGroup;

  const backgroundGeometry = new THREE.PlaneGeometry(3, 4);
  const backgroundMesh = new THREE.Mesh(backgroundGeometry, materialMap['background-white']);
  backgroundMesh.name = 'Background Plane';
  backgroundMesh.position.z = 0;
  backgroundGroup.add(backgroundMesh);
  meshes['background-plane'] = backgroundMesh;
  colliders['background-plane'] = { type: 'box', offset: [0, 0, -0.2], scale: [1, 1, 1], isTrigger: false };

  root.userData.sculptRuntime = { nodes, meshes, sockets, colliders, destructionGroups } satisfies ProceduralModelRuntime;
  root.userData.lookDevTargets = {
    qualityPriority: 'reference-fidelity',
    materialPass: {
      albedoPaletteRequired: true,
      roughnessVariationRequired: true,
      normalOrBumpRequired: true,
      localOverridesRequired: true,
      minimumTextureResolution: 1024,
      preferredTextureResolution: 2048,
      independentMapChannels: ['albedo', 'roughness', 'height', 'normal', 'ambient-occlusion'],
      requiredSurfaceFrequencyBands: ['macro', 'meso', 'micro'],
      geometryReliefRequiredWhenSilhouetteAffected: true,
      referencePbrExtraction: {
        requiredWhenSourceImagePresent: false,
        targetThreshold: 0.7,
        stopOnLowConfidence: true,
        script: 'forge/stage1_intake/extract_pbr_evidence.py',
        acceptedLimitation: 'single-image extraction is reference-derived inference, not exact photogrammetry',
      },
      mustAvoid: [
        'single flat albedo per material',
        'uniform roughness',
        'albedo texture reused as roughness/height/normal/AO',
        'single-frequency random noise',
        'plastic-looking smooth bark, stone, cloth, foliage, or aged material',
        'local color/detail described only in prose without material masks',
        'claiming exact PBR recovery when confidence is below the target threshold',
      ],
    },
    lightingPass: {
      requiredTerms: ['key light', 'fill light', 'rim or environment light', 'exposure', 'tone mapping', 'background', 'contact shadow'],
      mustAvoid: ['ambient-only lighting', 'flat value range', 'missing contact shadow', 'reference lighting copied without separating material readability'],
    },
    screenshotReview: [
      'Compare albedo palette and local color zones.',
      'Compare roughness/normal/bump response under light.',
      'Compare cavity dirt, edge wear, stains, moss, scratches, or other local masks.',
      'Compare key/fill/rim structure, exposure, tone mapping, background, and contact shadows.',
      'Capture a neutral-light render to verify material readability without reference lighting.',
      'Capture a grazing-light close-up to expose flat normals, uniform roughness, tiling, and plastic highlights.',
      'Capture a reference-matched render from the same camera framing as the source.',
    ],
  };
  root.userData.actionReadiness = {
    note: 'Use root.userData.sculptRuntime.nodes for transforms, sockets for attachments, colliders for physics proxies, and destructionGroups for breakable sets.',
  };
  return root;
}

export function createSanjaLogoLookDevLights(
  mode: 'neutral' | 'grazing' | 'reference' = 'neutral',
): THREE.Group {
  const lights = new THREE.Group();
  lights.name = 'Sanja Logo look-dev lights';
  const hemi = new THREE.HemisphereLight(
    mode === 'reference' ? 0xfff0d6 : 0xf2f4ff,
    0x363b42,
    mode === 'grazing' ? 0.28 : mode === 'reference' ? 0.72 : 0.85,
  );
  lights.add(hemi);
  const key = new THREE.DirectionalLight(
    mode === 'reference' ? 0xffcf8a : 0xfff4e8,
    mode === 'grazing' ? 4.2 : mode === 'reference' ? 2.6 : 2.15,
  );
  key.position.set(2, 3, 4);
  lights.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, mode === 'grazing' ? 0.35 : 0.4);
  fill.position.set(-2, 1, 2);
  lights.add(fill);
  return lights;
}

export function createSanjaLogoEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const scene = new THREE.Scene();
  const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  pmremGenerator.dispose();
  return envTexture;
}

export function createSanjaLogoPresentationComposer(
  renderer: THREE.WebGLRenderer,
  options: ProceduralModelOptions = {},
): EffectComposer {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(renderer.domElement.parentNode as any, renderer.domElement));
  if (options.qualityPriority === 'reference-fidelity') {
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.15,
      0.4,
      0.85,
    );
    composer.addPass(bloomPass);
  }
  return composer;
}

export function createSanjaLogoInspectControls(camera: THREE.Camera, domElement: HTMLElement): OrbitControls {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.minDistance = 1;
  controls.maxDistance = 8;
  controls.autoRotate = false;
  return controls;
}
