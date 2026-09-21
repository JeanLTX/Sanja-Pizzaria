import json

spec_path = r"C:\Users\jeanl\Desktop\Sanja Pizzaria\.img2threejs\object-sculpt-spec.json"
with open(spec_path, "r", encoding="utf-8") as f:
    data = json.load(f)

data["preSpecAssessment"]["unknownsToResolveBeforeImplementation"] = []

data["preSpecAssessment"]["complexity"]["estimatedCounts"]["mesoComponents"] = 8
data["preSpecAssessment"]["complexity"]["estimatedCounts"]["microFeatureGroups"] = 6
data["preSpecAssessment"]["complexity"]["estimatedCounts"]["materialLayers"] = 8

data["qualityContract"]["minimumSpecDepth"]["mesoComponents"] = 8
data["qualityContract"]["minimumSpecDepth"]["microFeatureGroups"] = 6
data["qualityContract"]["minimumSpecDepth"]["materialLayers"] = 8

for material in data["materials"]:
    material.pop("referencePbr", None)
    material.pop("referencePbrExtraction", None)
    if material["id"] == "background-white":
        for band in material.get("surfaceFrequencyBands", []):
            band["amplitude"] = 0.01

with open(spec_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("fixed")
