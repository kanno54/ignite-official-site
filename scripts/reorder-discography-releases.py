import json

print("--- REORDERING DISCOGRAPHY RELEASES BY CHRONOLOGICAL RELEASE DATE ---")

disc_path = "content/public/discography.json"
with open(disc_path, "r", encoding="utf-8") as f:
    disc_data = json.load(f)

# Sort releases by fictionalReleaseDate ascending (Oldest to Newest)
# Dates:
# firestarter: 2020-10
# ignition: 2021-07
# burn-it-down: 2021-10
# no-limits: 2022-09
# moonlit: 2023-05
# solar: 2023-08
# silent-signal: 2024-01
# rise-again: 2024-03

date_order = {
    "firestarter": "2020-10",
    "ignition": "2021-07",
    "burn-it-down": "2021-10",
    "no-limits": "2022-09",
    "moonlit": "2023-05",
    "solar": "2023-08",
    "silent-signal": "2024-01",
    "rise-again": "2024-03"
}

disc_data["releases"].sort(key=lambda r: date_order.get(r["id"], r.get("fictionalReleaseDate", "")))

for idx, r in enumerate(disc_data["releases"]):
    print(f"  [{idx}] {r['id']} ({r.get('fictionalReleaseDateFull')})")

with open(disc_path, "w", encoding="utf-8") as f:
    json.dump(disc_data, f, ensure_ascii=False, indent=2)

print("[OK] Reordered discography.json releases in strict chronological order.")
