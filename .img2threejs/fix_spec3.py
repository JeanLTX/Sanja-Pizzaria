import json

spec_path = r"C:\Users\jeanl\Desktop\Sanja Pizzaria\.img2threejs\object-sculpt-spec.json"
with open(spec_path, "r", encoding="utf-8") as f:
    data = json.load(f)

for component in data["componentTree"]:
    component["evidenceRefs"] = [
        ref for ref in component.get("evidenceRefs", [])
        if ref != "full-object" and not ref.endswith("/full-object")
    ]

di_path = r"C:\Users\jeanl\Desktop\Sanja Pizzaria\di.json"
with open(di_path, "r", encoding="utf-8") as f:
    di = json.load(f)

kind_map = {
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

for detail in di["detailInventory"]["details"]:
    if detail["id"] in kind_map:
        detail["kind"] = kind_map[detail["id"]]

with open(di_path, "w", encoding="utf-8") as f:
    json.dump(di, f, indent=2)

with open(spec_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("fixed")
