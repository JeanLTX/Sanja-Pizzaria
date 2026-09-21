import json

spec_path = r"C:\Users\jeanl\Desktop\Sanja Pizzaria\.img2threejs\object-sculpt-spec.json"
with open(spec_path, "r", encoding="utf-8") as f:
    data = json.load(f)

data["preSpecAssessment"]["complexity"]["estimatedCounts"]["mesoComponents"] = 8
data["preSpecAssessment"]["complexity"]["estimatedCounts"]["microFeatureGroups"] = 6
data["preSpecAssessment"]["complexity"]["estimatedCounts"]["materialLayers"] = 8

data["qualityContract"]["minimumSpecDepth"]["mesoComponents"] = 8
data["qualityContract"]["minimumSpecDepth"]["microFeatureGroups"] = 6
data["qualityContract"]["minimumSpecDepth"]["materialLayers"] = 8

data["lightingFromPhoto"] = [
    {"type": "key light", "direction": "front-top-right", "color": "#FFFFFF", "intensity": 1.0},
    {"type": "fill light", "direction": "front-left", "color": "#F0F0F0", "intensity": 0.4},
    {"type": "rim light", "direction": "back-top", "color": "#FFFFFF", "intensity": 0.6},
    {"type": "ambient", "color": "#404040", "intensity": 0.3},
    {"type": "environment", "source": "neutral HDRI", "intensity": 0.5},
]

data["featureReviewTargets"] = [
    {
        "id": "logo-silhouette",
        "name": "Logo silhouette and proportions",
        "tier": "critical",
        "passIds": ["blockout"],
        "minimumScore": 0.8,
        "mustPass": True,
        "componentRefs": ["root"],
        "evidenceRefs": ["full-object"]
    },
    {
        "id": "food-icon-system",
        "name": "Food icon assembly (pizza, grill, flame, leaf)",
        "tier": "critical",
        "passIds": ["structural-pass", "form-refinement"],
        "minimumScore": 0.8,
        "mustPass": True,
        "componentRefs": ["icon-assembly"],
        "evidenceRefs": ["zone-r0c1", "zone-r0c2", "zone-r1c1", "zone-r0c0"]
    },
    {
        "id": "typography-and-divider",
        "name": "SANJA text with horizontal divider and tagline",
        "tier": "critical",
        "passIds": ["structural-pass", "form-refinement"],
        "minimumScore": 0.8,
        "mustPass": True,
        "componentRefs": ["sanja-text", "tagline-text"],
        "evidenceRefs": ["zone-r1c1", "zone-r2c1"]
    },
    {
        "id": "frame-and-swoosh",
        "name": "Oval frame with green inner arcs and bottom swoosh",
        "tier": "important",
        "passIds": ["structural-pass", "form-refinement"],
        "minimumScore": 0.75,
        "mustPass": True,
        "componentRefs": ["oval-frame", "bottom-swoosh"],
        "evidenceRefs": ["zone-r1c0", "zone-r0c1", "zone-r2c1"]
    },
    {
        "id": "material-surface-response",
        "name": "Material color, roughness, and surface finish",
        "tier": "critical",
        "passIds": ["material-pass", "surface-pass"],
        "minimumScore": 0.75,
        "mustPass": True,
        "componentRefs": ["root"],
        "evidenceRefs": ["full-object"]
    }
]

with open(spec_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("fixed counts, lighting, featureReviewTargets")
