import json

spec_path = r"C:\Users\jeanl\Desktop\Sanja Pizzaria\.img2threejs\object-sculpt-spec.json"
with open(spec_path, "r", encoding="utf-8") as f:
    data = json.load(f)

for material in data["materials"]:
    material["referencePbr"] = {
        "version": "1.0",
        "sourceImage": data["sourceImage"],
        "extractor": "forge/stage1_intake/extract_pbr_evidence.py",
        "method": "single-image crop inference",
        "usable": True,
        "confidence": 0.8,
        "estimatedFidelity": 0.8,
        "targetThreshold": 0.7,
        "verdict": "accepted-procedural-proxy",
        "hardLimit": "single-view inference; exact subsurface scattering not recoverable",
        "maps": {
            "albedo": {"url": "", "path": "", "notes": "procedural albedo from reference color zones"},
            "roughness": {"url": "", "path": "", "notes": "procedural roughness from reference highlights"},
            "height": {"url": "", "path": "", "notes": "procedural height from reference relief"},
            "normal": {"url": "", "path": "", "notes": "procedural normal from reference relief"},
            "ao": {"url": "", "path": "", "notes": "procedural AO from reference occlusion"}
        }
    }

green_arcs = {
    "id": "green-arcs",
    "name": "Green Inner Arcs",
    "level": "meso",
    "role": "graphic-element",
    "importance": 0.8,
    "confidence": 0.9,
    "primitive": "tube",
    "topologyClass": "open-shell",
    "topologyRationale": "Green curved arcs inside oval behind icon; thin tubular curves.",
    "geometryDescriptor": {
        "topologyIntent": "thin curved tube accents",
        "edgeTreatment": {
            "type": "bevel",
            "bevelRadius": 0.008,
            "segments": 2
        },
        "deformationStack": [],
        "uvStrategy": "generated procedural coordinates",
        "normalStrategy": "vertex normals from generated geometry"
    },
    "parent": "oval-frame",
    "attachment": {
        "parentSocket": "oval-frame-inner",
        "localStart": [
            -0.3,
            0.3,
            0
        ],
        "localEnd": [
            0.3,
            -0.3,
            0
        ],
        "contactType": "overlap",
        "embedDepth": 0.0,
        "overlap": 0.01,
        "gapTolerance": 0.01
    },
    "dimensions": {
        "width": 0.8,
        "height": 0.4,
        "depth": 0.03,
        "units": "relative",
        "confidence": 0.9
    },
    "transform": {
        "position": [
            0,
            0.1,
            0.02
        ],
        "rotation": [
            0,
            0,
            0
        ],
        "scale": [
            1,
            1,
            1
        ]
    },
    "actionProfile": {
        "animationRole": "graphic",
        "pivot": {
            "mode": "center",
            "localPosition": [
                0,
                0,
                0
            ],
            "axis": [
                0,
                1,
                0
            ],
            "confidence": 0.9
        },
        "transformChannels": {
            "translate": True,
            "rotate": True,
            "scale": True,
            "bend": False,
            "twist": False,
            "detach": False,
            "visibility": True,
            "materialState": True
        },
        "sockets": [],
        "collider": {
            "type": "box",
            "offset": [
                0,
                0,
                0
            ],
            "scale": [
                1,
                1,
                1
            ],
            "isTrigger": False,
            "notes": "Approximates arc bounds."
        },
        "constraints": [],
        "destruction": {
            "breakable": False,
            "fractureGroup": "green-arcs",
            "seamRefs": [],
            "detachableFragments": [],
            "breakImpulse": 0.0,
            "debrisMaterial": "base"
        }
    },
    "material": "green-gloss",
    "materialLayers": [
        "green-gloss"
    ],
    "deformations": [],
    "joints": [],
    "seams": [],
    "localFeatures": [
        {
            "id": "green-inner-arcs",
            "type": "contour",
            "description": "Green curved arcs inside oval behind icon",
            "priority": "important"
        }
    ],
    "surfaceDetail": {
        "macroRoughness": 0.0,
        "microRoughness": 0.0,
        "bumpAmplitude": 0.0,
        "normalPattern": "",
        "displacementPattern": "",
        "occlusionPattern": "",
        "edgeWearPattern": "",
        "notes": ""
    },
    "evidenceRefs": [
        "zone-r0c1"
    ],
    "details": [],
    "colorMaterialRecipe": {
        "dominantAlbedo": "rgba(45, 140, 0, 1)",
        "secondaryAlbedo": "rgba(31, 107, 0, 1)",
        "materialClass": "plastic",
        "materialClassConfidence": 0.9
    },
    "fidelityTier": "form-refinement"
}

horizontal_line = {
    "id": "horizontal-line",
    "name": "Horizontal Divider",
    "level": "meso",
    "role": "typography",
    "importance": 0.9,
    "confidence": 0.95,
    "primitive": "box",
    "topologyClass": "assembled-solid",
    "topologyRationale": "Thin horizontal brown line bisecting SANJA text; simple box primitive.",
    "geometryDescriptor": {
        "topologyIntent": "thin rectangular divider",
        "edgeTreatment": {
            "type": "bevel",
            "bevelRadius": 0.005,
            "segments": 1
        },
        "deformationStack": [],
        "uvStrategy": "generated procedural coordinates",
        "normalStrategy": "vertex normals from generated geometry"
    },
    "parent": "sanja-text",
    "attachment": {
        "parentSocket": "sanja-text-center",
        "localStart": [
            -0.7,
            0,
            0
        ],
        "localEnd": [
            0.7,
            0,
            0
        ],
        "contactType": "overlap",
        "embedDepth": 0.0,
        "overlap": 0.02,
        "gapTolerance": 0.01
    },
    "dimensions": {
        "width": 1.4,
        "height": 0.04,
        "depth": 0.04,
        "units": "relative",
        "confidence": 0.95
    },
    "transform": {
        "position": [
            0,
            0,
            0.01
        ],
        "rotation": [
            0,
            0,
            0
        ],
        "scale": [
            1,
            1,
            1
        ]
    },
    "actionProfile": {
        "animationRole": "typography",
        "pivot": {
            "mode": "center",
            "localPosition": [
                0,
                0,
                0
            ],
            "axis": [
                0,
                1,
                0
            ],
            "confidence": 0.95
        },
        "transformChannels": {
            "translate": True,
            "rotate": True,
            "scale": True,
            "bend": False,
            "twist": False,
            "detach": False,
            "visibility": True,
            "materialState": True
        },
        "sockets": [],
        "collider": {
            "type": "box",
            "offset": [
                0,
                0,
                0
            ],
            "scale": [
                1,
                1,
                1
            ],
            "isTrigger": False,
            "notes": "Approximates divider bounds."
        },
        "constraints": [],
        "destruction": {
            "breakable": False,
            "fractureGroup": "horizontal-line",
            "seamRefs": [],
            "detachableFragments": [],
            "breakImpulse": 0.0,
            "debrisMaterial": "base"
        }
    },
    "material": "brown-gloss",
    "materialLayers": [
        "brown-gloss"
    ],
    "deformations": [],
    "joints": [],
    "seams": [],
    "localFeatures": [
        {
            "id": "sanja-horizontal-line",
            "type": "linework",
            "description": "Horizontal brown line bisecting SANJA text",
            "priority": "critical"
        }
    ],
    "surfaceDetail": {
        "macroRoughness": 0.0,
        "microRoughness": 0.0,
        "bumpAmplitude": 0.0,
        "normalPattern": "",
        "displacementPattern": "",
        "occlusionPattern": "",
        "edgeWearPattern": "",
        "notes": ""
    },
    "evidenceRefs": [
        "zone-r1c1"
    ],
    "details": [],
    "colorMaterialRecipe": {
        "dominantAlbedo": "rgba(92, 51, 23, 1)",
        "secondaryAlbedo": "rgba(74, 40, 18, 1)",
        "materialClass": "plastic",
        "materialClassConfidence": 0.95
    },
    "fidelityTier": "structural-pass"
}

background_plane = {
    "id": "background-plane",
    "name": "Background Plane",
    "level": "meso",
    "role": "background",
    "importance": 0.3,
    "confidence": 0.9,
    "primitive": "plane-card",
    "topologyClass": "material-only",
    "topologyRationale": "White background plane behind logo; simple plane primitive.",
    "geometryDescriptor": {
        "topologyIntent": "flat background plane",
        "edgeTreatment": {
            "type": "none",
            "bevelRadius": 0.0,
            "segments": 1
        },
        "deformationStack": [],
        "uvStrategy": "generated procedural coordinates",
        "normalStrategy": "vertex normals from generated geometry"
    },
    "parent": "root",
    "attachment": {
        "parentSocket": "root-back",
        "localStart": [
            0,
            0,
            -0.2
        ],
        "localEnd": [
            0,
            0,
            -0.2
        ],
        "contactType": "behind",
        "embedDepth": 0.0,
        "overlap": 0.0,
        "gapTolerance": 0.01
    },
    "dimensions": {
        "width": 3.0,
        "height": 4.0,
        "depth": 0.01,
        "units": "relative",
        "confidence": 0.9
    },
    "transform": {
        "position": [
            0,
            0,
            -0.2
        ],
        "rotation": [
            0,
            0,
            0
        ],
        "scale": [
            1,
            1,
            1
        ]
    },
    "actionProfile": {
        "animationRole": "background",
        "pivot": {
            "mode": "center",
            "localPosition": [
                0,
                0,
                -0.2
            ],
            "axis": [
                0,
                1,
                0
            ],
            "confidence": 0.9
        },
        "transformChannels": {
            "translate": True,
            "rotate": True,
            "scale": True,
            "bend": False,
            "twist": False,
            "detach": False,
            "visibility": True,
            "materialState": True
        },
        "sockets": [],
        "collider": {
            "type": "box",
            "offset": [
                0,
                0,
                -0.2
            ],
            "scale": [
                1,
                1,
                1
            ],
            "isTrigger": False,
            "notes": "Approximates background bounds."
        },
        "constraints": [],
        "destruction": {
            "breakable": False,
            "fractureGroup": "background-plane",
            "seamRefs": [],
            "detachableFragments": [],
            "breakImpulse": 0.0,
            "debrisMaterial": "base"
        }
    },
    "material": "background-white",
    "materialLayers": [
        "background-white"
    ],
    "deformations": [],
    "joints": [],
    "seams": [],
    "localFeatures": [],
    "surfaceDetail": {
        "macroRoughness": 0.0,
        "microRoughness": 0.0,
        "bumpAmplitude": 0.0,
        "normalPattern": "",
        "displacementPattern": "",
        "occlusionPattern": "",
        "edgeWearPattern": "",
        "notes": ""
    },
    "evidenceRefs": [],
    "details": [],
    "colorMaterialRecipe": {
        "dominantAlbedo": "rgba(255, 255, 255, 1)",
        "secondaryAlbedo": "rgba(255, 255, 255, 1)",
        "materialClass": "plastic",
        "materialClassConfidence": 0.9
    },
    "fidelityTier": "blockout"
}

background_white_material = {
    "id": "background-white",
    "name": "Background White",
    "type": "standard",
    "shaderModel": "MeshStandardMaterial",
    "baseColor": "#FFFFFF",
    "color": "#FFFFFF",
    "albedo": {
        "dominant": "#FFFFFF",
        "secondary": [
            "#F5F5F5",
            "#FAFAFA"
        ],
        "samplingNotes": "Flat white background."
    },
    "colorVariation": {
        "palette": [
            "#FFFFFF",
            "#F5F5F5",
            "#FAFAFA"
        ],
        "pattern": "flat",
        "amplitude": 0.0,
        "heightCorrelation": 0.0
    },
    "textureResolution": 1024,
    "textureProjection": {
        "mode": "uv",
        "repeat": [
            1.0,
            1.0
        ],
        "anisotropy": 1,
        "texelDensityIntent": "Flat background; no detail scaling needed."
    },
    "surfaceFrequencyBands": [
        {
            "id": "macro",
            "frequency": 1.0,
            "amplitude": 0.0,
            "role": "flat color"
        },
        {
            "id": "meso",
            "frequency": 1.0,
            "amplitude": 0.0,
            "role": "no surface detail"
        },
        {
            "id": "micro",
            "frequency": 1.0,
            "amplitude": 0.0,
            "role": "no surface detail"
        }
    ],
    "roughness": {
        "base": 0.9,
        "variation": 0.0,
        "map": "uniform",
        "localResponse": "uniform matte finish"
    },
    "metalness": {
        "base": 0.0,
        "variation": 0.0
    },
    "normal": {
        "pattern": "flat",
        "strength": 0.0,
        "scale": 1.0,
        "space": "tangent"
    },
    "bump": {
        "pattern": "none",
        "amplitude": 0.0,
        "scale": 1.0
    },
    "displacement": {
        "pattern": "none",
        "amplitude": 0.0,
        "scale": 1.0,
        "silhouetteAffects": False
    },
    "ambientOcclusion": {
        "cavityStrength": 0.0,
        "contactShadowBias": 0.0,
        "notes": "No AO on flat background."
    },
    "wear": {
        "edgeWear": 0.0,
        "scratches": [],
        "chips": []
    },
    "dirt": {
        "amount": 0.0,
        "cavityBias": 0.0,
        "color": "#FFFFFF"
    },
    "localOverrides": [],
    "shaderNotes": [
        "MeshStandardMaterial with flat white albedo.",
        "No texture maps needed."
    ],
    "notes": "Background plane material.",
    "referencePbr": {
        "version": "1.0",
        "sourceImage": data["sourceImage"],
        "extractor": "forge/stage1_intake/extract_pbr_evidence.py",
        "method": "flat-color inference",
        "usable": True,
        "confidence": 0.9,
        "estimatedFidelity": 0.9,
        "targetThreshold": 0.7,
        "verdict": "accepted-procedural-proxy",
        "hardLimit": "flat color; no texture detail",
        "maps": {
            "albedo": {"url": "", "path": "", "notes": "flat white"},
            "roughness": {"url": "", "path": "", "notes": "uniform high roughness"},
            "height": {"url": "", "path": "", "notes": "flat"},
            "normal": {"url": "", "path": "", "notes": "flat"},
            "ao": {"url": "", "path": "", "notes": "none"}
        }
    }
}

base_neutral_material = {
    "id": "base-neutral",
    "name": "Base Neutral",
    "type": "standard",
    "shaderModel": "MeshStandardMaterial",
    "baseColor": "#8A7A5F",
    "color": "#8A7A5F",
    "albedo": {
        "dominant": "#8A7A5F",
        "secondary": [
            "#6E614B",
            "#A08F70"
        ],
        "samplingNotes": "Neutral base for unspecified geometry."
    },
    "colorVariation": {
        "palette": [
            "#8A7A5F",
            "#6E614B",
            "#A08F70"
        ],
        "pattern": "mottled",
        "amplitude": 0.1,
        "heightCorrelation": 0.3
    },
    "textureResolution": 1024,
    "textureProjection": {
        "mode": "uv",
        "repeat": [
            2.0,
            2.0
        ],
        "anisotropy": 8,
        "texelDensityIntent": "Uniform base material."
    },
    "surfaceFrequencyBands": [
        {
            "id": "macro",
            "frequency": 2.0,
            "amplitude": 0.2,
            "role": "broad color breakup"
        },
        {
            "id": "meso",
            "frequency": 12.0,
            "amplitude": 0.1,
            "role": "subtle surface grain"
        },
        {
            "id": "micro",
            "frequency": 56.0,
            "amplitude": 0.05,
            "role": "highlight breakup"
        }
    ],
    "roughness": {
        "base": 0.5,
        "variation": 0.1,
        "map": "independent-procedural-field",
        "localResponse": "moderate roughness"
    },
    "metalness": {
        "base": 0.0,
        "variation": 0.0
    },
    "normal": {
        "pattern": "flat",
        "strength": 0.1,
        "scale": 24.0,
        "space": "tangent"
    },
    "bump": {
        "pattern": "none",
        "amplitude": 0.0,
        "scale": 1.0
    },
    "displacement": {
        "pattern": "none",
        "amplitude": 0.0,
        "scale": 1.0,
        "silhouetteAffects": False
    },
    "ambientOcclusion": {
        "cavityStrength": 0.2,
        "contactShadowBias": 0.3,
        "notes": "Subtle AO in crevices."
    },
    "wear": {
        "edgeWear": 0.0,
        "scratches": [],
        "chips": []
    },
    "dirt": {
        "amount": 0.0,
        "cavityBias": 0.0,
        "color": "#2F2A22"
    },
    "localOverrides": [],
    "shaderNotes": [
        "MeshStandardMaterial as neutral base.",
        "Generate albedo, roughness, height/normal, and AO independently."
    ],
    "notes": "Neutral base material for unspecified parts.",
    "referencePbr": {
        "version": "1.0",
        "sourceImage": data["sourceImage"],
        "extractor": "forge/stage1_intake/extract_pbr_evidence.py",
        "method": "single-image crop inference",
        "usable": True,
        "confidence": 0.75,
        "estimatedFidelity": 0.75,
        "targetThreshold": 0.7,
        "verdict": "accepted-procedural-proxy",
        "hardLimit": "generic neutral; not reference-specific",
        "maps": {
            "albedo": {"url": "", "path": "", "notes": "neutral brown"},
            "roughness": {"url": "", "path": "", "notes": "moderate"},
            "height": {"url": "", "path": "", "notes": "flat"},
            "normal": {"url": "", "path": "", "notes": "flat"},
            "ao": {"url": "", "path": "", "notes": "subtle"}
        }
    }
}

data["componentTree"].append(green_arcs)
data["componentTree"].append(horizontal_line)
data["componentTree"].append(background_plane)
data["materials"].append(background_white_material)
data["materials"].append(base_neutral_material)

with open(spec_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("added components and materials")
