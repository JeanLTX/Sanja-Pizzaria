import json

spec_path = r"C:\Users\jeanl\Desktop\Sanja Pizzaria\.img2threejs\object-sculpt-spec.json"
with open(spec_path, "r", encoding="utf-8") as f:
    data = json.load(f)

valid_topology = [
    "assembled-solid",
    "conforming-shell",
    "continuous-sculpt",
    "fiber-strand",
    "implicit",
    "material-only",
    "open-shell",
    "surface-relief",
]

for component in data["componentTree"]:
    if component.get("topologyClass") not in valid_topology:
        component["topologyClass"] = "assembled-solid"

    new_evidence = []
    for ref in component.get("evidenceRefs", []):
        if isinstance(ref, str) and not ref.startswith("C:"):
            new_evidence.append("C:/Users/jeanl/Desktop/Sanja Pizzaria/.img2threejs/" + ref)
        else:
            new_evidence.append(ref)
    component["evidenceRefs"] = new_evidence

    if "colorMaterialRecipe" not in component:
        mat_id = component.get("material", "brown-gloss")
        component["colorMaterialRecipe"] = {
            "albedo": mat_id,
            "roughness": 0.3,
            "metalness": 0.0,
            "clearcoat": 0.1 if "gloss" in mat_id else 0.0,
        }

for material in data["materials"]:
    if material["id"] in ("brown-gloss", "green-gloss"):
        material["doubleSided"] = True

with open(spec_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("fixed")
