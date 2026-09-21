import json

spec_path = r"C:\Users\jeanl\Desktop\Sanja Pizzaria\.img2threejs\object-sculpt-spec.json"
with open(spec_path, "r", encoding="utf-8") as f:
    data = json.load(f)

data["viewEvidence"] = [
    {"id": "full-object", "view": "primary", "imageRegion": {"x": 0.0, "y": 0.0, "width": 1.0, "height": 1.0, "units": "normalized"}, "observations": [], "confidence": 0.5},
    {"id": "zone-r0c0", "view": "upper-left", "imageRegion": {"x": 0.0, "y": 0.0, "width": 0.3333, "height": 0.3333, "units": "normalized"}, "observations": [], "confidence": 0.9},
    {"id": "zone-r0c1", "view": "upper-center", "imageRegion": {"x": 0.3333, "y": 0.0, "width": 0.3333, "height": 0.3333, "units": "normalized"}, "observations": [], "confidence": 0.9},
    {"id": "zone-r0c2", "view": "upper-right", "imageRegion": {"x": 0.6667, "y": 0.0, "width": 0.3333, "height": 0.3333, "units": "normalized"}, "observations": [], "confidence": 0.9},
    {"id": "zone-r1c0", "view": "middle-left", "imageRegion": {"x": 0.0, "y": 0.3333, "width": 0.3333, "height": 0.3333, "units": "normalized"}, "observations": [], "confidence": 0.9},
    {"id": "zone-r1c1", "view": "center", "imageRegion": {"x": 0.3333, "y": 0.3333, "width": 0.3333, "height": 0.3333, "units": "normalized"}, "observations": [], "confidence": 0.9},
    {"id": "zone-r1c2", "view": "middle-right", "imageRegion": {"x": 0.6667, "y": 0.3333, "width": 0.3333, "height": 0.3333, "units": "normalized"}, "observations": [], "confidence": 0.9},
    {"id": "zone-r2c0", "view": "lower-left", "imageRegion": {"x": 0.0, "y": 0.6667, "width": 0.3333, "height": 0.3333, "units": "normalized"}, "observations": [], "confidence": 0.9},
    {"id": "zone-r2c1", "view": "lower-center", "imageRegion": {"x": 0.3333, "y": 0.6667, "width": 0.3333, "height": 0.3333, "units": "normalized"}, "observations": [], "confidence": 0.9},
    {"id": "zone-r2c2", "view": "lower-right", "imageRegion": {"x": 0.6667, "y": 0.6667, "width": 0.3333, "height": 0.3333, "units": "normalized"}, "observations": [], "confidence": 0.9},
]

with open(spec_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("fixed viewEvidence")
