import json

print("--- PROMOTING RISE AGAIN TO CURRENT ERA ---")

# 1. Update discography.json
disc_path = "content/public/discography.json"
with open(disc_path, "r", encoding="utf-8") as f:
    disc_data = json.load(f)

for r in disc_data["releases"]:
    if r["id"] == "rise-again":
        r["campaignState"] = "current"
        r["publication"]["campaignState"] = "current"
    elif r["id"] == "silent-signal":
        r["campaignState"] = "past"
        r["publication"]["campaignState"] = "current"
    elif r["id"] == "solar":
        r["campaignState"] = "past"
        r["publication"]["campaignState"] = "current"

with open(disc_path, "w", encoding="utf-8") as f:
    json.dump(disc_data, f, ensure_ascii=False, indent=2)
print("  [OK] Updated discography.json: rise-again -> current, silent-signal -> past.")

# 2. Update campaigns.json
camp_path = "content/public/campaigns.json"
with open(camp_path, "r", encoding="utf-8") as f:
    camp_data = json.load(f)

for c in camp_data:
    if c["id"] == "rise-again":
        c["status"] = "current"
    elif c["id"] == "silent-signal":
        c["status"] = "past"
    elif c["id"] == "solar":
        c["status"] = "past"

with open(camp_path, "w", encoding="utf-8") as f:
    json.dump(camp_data, f, ensure_ascii=False, indent=2)
print("  [OK] Updated campaigns.json: rise-again -> current, silent-signal -> past.")

# 3. Update articles.json
art_path = "content/public/articles.json"
with open(art_path, "r", encoding="utf-8") as f:
    art_data = json.load(f)

for a in art_data:
    if a["id"] == "rise-again-feature-article":
        a["publication"]["campaignState"] = "current"
    elif a["id"] == "silent-signal-sho-interview":
        a["publication"]["campaignState"] = "current"

with open(art_path, "w", encoding="utf-8") as f:
    json.dump(art_data, f, ensure_ascii=False, indent=2)
print("  [OK] Updated articles.json: rise-again-feature-article -> current.")

print("[OK] RISE AGAIN successfully set as CURRENT ERA across all data files.")
