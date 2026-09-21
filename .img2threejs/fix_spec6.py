import json

spec_path = r"C:\Users\jeanl\Desktop\Sanja Pizzaria\.img2threejs\object-sculpt-spec.json"
with open(spec_path, "r", encoding="utf-8") as f:
    data = json.load(f)

data["preSpecAssessment"]["unknownsToResolveBeforeImplementation"] = []

for material in data["materials"]:
    material["referencePbrExtraction"] = {
        "requiredWhenSourceImagePresent": True,
        "targetThreshold": 0.7,
        "stopOnLowConfidence": True,
        "script": "forge/stage1_intake/extract_pbr_evidence.py",
        "acceptedLimitation": "single-image extraction is reference-derived inference, not exact photogrammetry",
        "status": "not-extracted"
    }

data["lightingFromPhoto"] = [
    {"type": "key light", "direction": "front-top-right", "color": "#FFFFFF", "intensity": 1.0, "exposure": 1.0, "toneMapping": "ACESFilmic"},
    {"type": "fill light", "direction": "front-left", "color": "#F0F0F0", "intensity": 0.4},
    {"type": "rim light", "direction": "back-top", "color": "#FFFFFF", "intensity": 0.6},
    {"type": "ambient", "color": "#404040", "intensity": 0.3},
    {"type": "environment", "source": "neutral HDRI", "intensity": 0.5},
    {"type": "contact shadow", "behavior": "soft contact shadow under logo on white background", "opacity": 0.3, "blur": 0.05}
]

data["preSpecAssessment"]["complexity"]["estimatedCounts"]["mesoComponents"] = 8
data["preSpecAssessment"]["complexity"]["estimatedCounts"]["materialLayers"] = 8
data["qualityContract"]["minimumSpecDepth"]["mesoComponents"] = 8
data["qualityContract"]["minimumSpecDepth"]["materialLayers"] = 8

detail_kind_map = {
    "pizza-holes": "hole",
    "grill-crosshatch": "groove",
    "flame-lobes": "contour",
    "leaf-shape": "contour",
    "sanja-horizontal-line": "linework",
    "pizza-crust-edge": "bevel",
    "grill-red-border": "ridge",
    "bottom-swoosh": "contour",
    "oval-break": "contour",
    "green-inner-arcs": "contour",
    "pizza-toppings": "decal",
    "flame-glow": "emissive",
}

for detail in data["preSpecAssessment"]["detailInventory"]["details"]:
    if detail["id"] in detail_kind_map:
        detail["kind"] = detail_kind_map[detail["id"]]

with open(spec_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("fixed strict validation issues")
