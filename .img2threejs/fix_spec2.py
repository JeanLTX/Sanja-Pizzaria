import json

spec_path = r"C:\Users\jeanl\Desktop\Sanja Pizzaria\.img2threejs\object-sculpt-spec.json"
with open(spec_path, "r", encoding="utf-8") as f:
    data = json.load(f)

material_colors = {
    "brown-gloss": {"dominant": "rgba(92, 51, 23, 1)", "secondary": "rgba(74, 40, 18, 1)", "materialClass": "plastic", "confidence": 0.9},
    "green-gloss": {"dominant": "rgba(45, 140, 0, 1)", "secondary": "rgba(31, 107, 0, 1)", "materialClass": "plastic", "confidence": 0.9},
    "pizza-slice-material": {"dominant": "rgba(255, 183, 0, 1)", "secondary": "rgba(255, 201, 64, 1)", "materialClass": "plastic", "confidence": 0.9},
    "grill-half-material": {"dominant": "rgba(26, 10, 0, 1)", "secondary": "rgba(15, 5, 0, 1)", "materialClass": "plastic", "confidence": 0.9},
    "flame-material": {"dominant": "rgba(255, 34, 0, 1)", "secondary": "rgba(255, 68, 0, 1)", "materialClass": "plastic", "confidence": 0.85},
    "leaf-material": {"dominant": "rgba(107, 142, 35, 1)", "secondary": "rgba(85, 107, 47, 1)", "materialClass": "plastic", "confidence": 0.9},
}

for component in data["componentTree"]:
    mat_id = component.get("material")
    if mat_id in material_colors:
        mc = material_colors[mat_id]
        component["colorMaterialRecipe"] = {
            "dominantAlbedo": mc["dominant"],
            "secondaryAlbedo": mc["secondary"],
            "materialClass": mc["materialClass"],
            "materialClassConfidence": mc["confidence"],
        }

    new_evidence = []
    for ref in component.get("evidenceRefs", []):
        if ref == "full-object":
            continue
        if isinstance(ref, str) and not ref.startswith("C:"):
            new_evidence.append("C:/Users/jeanl/Desktop/Sanja Pizzaria/.img2threejs/" + ref)
        else:
            new_evidence.append(ref)
    component["evidenceRefs"] = new_evidence

    if component["id"] == "oval-frame":
        component["materialLayers"] = ["brown-gloss"]
    elif component["id"] == "icon-assembly":
        component["materialLayers"] = ["brown-gloss"]
    elif component["id"] == "pizza-slice":
        component["materialLayers"] = ["pizza-slice-material"]
    elif component["id"] == "grill-half":
        component["materialLayers"] = ["grill-half-material"]
    elif component["id"] == "flame":
        component["materialLayers"] = ["flame-material"]
    elif component["id"] == "leaf":
        component["materialLayers"] = ["leaf-material"]
    elif component["id"] == "sanja-text":
        component["materialLayers"] = ["brown-gloss"]
    elif component["id"] == "tagline-text":
        component["materialLayers"] = ["green-gloss"]
    elif component["id"] == "bottom-swoosh":
        component["materialLayers"] = ["green-gloss"]

data["preSpecAssessment"]["complexity"]["estimatedCounts"]["mesoComponents"] = 8
data["preSpecAssessment"]["complexity"]["estimatedCounts"]["microFeatureGroups"] = 6
data["preSpecAssessment"]["complexity"]["estimatedCounts"]["materialLayers"] = 8

data["qualityContract"]["minimumSpecDepth"]["mesoComponents"] = 8
data["qualityContract"]["minimumSpecDepth"]["microFeatureGroups"] = 6
data["qualityContract"]["minimumSpecDepth"]["materialLayers"] = 8

data["buildPasses"][1]["id"] = "structural-pass"
data["buildPasses"][1]["goal"] = "Build the component hierarchy implied by the pre-spec complexity assessment."
data["buildPasses"][1]["acceptance"] = [
    "Macro, meso, and repeated structures meet qualityContract.minimumSpecDepth.",
    "Parent-child relations, joints, seams, sockets, and contact points are explicit.",
    "Every attached child appendage/connector has parentSocket, localStart/localEnd, contactType, embedDepth or overlap, and gapTolerance.",
    "AI vision comparison score meets selfCorrectLoop.visualAcceptance.threshold."
]

data["buildPasses"][2]["id"] = "form-refinement"
data["buildPasses"][2]["goal"] = "Refine shape, deformation, bevels, tapers, curves, asymmetry, and visible local geometry."
data["buildPasses"][2]["acceptance"] = [
    "Important visible forms are represented in component geometryDescriptor, deformations, localFeatures, or repetitionSystems.",
    "Endpoint-based child parts are rooted at their attachment sockets and do not visibly float away from parents.",
    "AI vision comparison score meets selfCorrectLoop.visualAcceptance.threshold."
]

with open(spec_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("fixed")
