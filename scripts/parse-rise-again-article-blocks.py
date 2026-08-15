import json

print("--- PARSING RISE AGAIN ARTICLE BLOCKS ---")

art_path = "content/public/articles.json"
with open(art_path, "r", encoding="utf-8") as f:
    art_data = json.load(f)

rise_again_art = None
for a in art_data:
    if a["id"] in ["rise-again-feature-article", "rise-again-feature"]:
        rise_again_art = a
        break

if not rise_again_art:
    print("[ERROR] rise-again-feature article not found!")
    exit(1)

body_md = rise_again_art.get("bodyMarkdown", "")

# Parse bodyMarkdown into clean structured blocks
blocks = []
sections = body_md.split("\n\n")

is_first_para = True
for sec in sections:
    sec_str = sec.strip()
    if not sec_str:
        continue
    if sec_str == "---":
        blocks.append({"type": "divider"})
    elif sec_str.startswith("# "):
        # Main title, skip or ignore as title is in article.title
        continue
    elif sec_str.startswith("## "):
        heading_text = sec_str.replace("## ", "").strip()
        blocks.append({"type": "heading", "content": heading_text})
    else:
        if is_first_para:
            blocks.append({"type": "lead", "content": sec_str})
            is_first_para = False
        else:
            blocks.append({"type": "paragraph", "content": sec_str})

rise_again_art["blocks"] = blocks
print(f"  [OK] Parsed {len(blocks)} blocks for RISE AGAIN feature article.")

with open(art_path, "w", encoding="utf-8") as f:
    json.dump(art_data, f, ensure_ascii=False, indent=2)

print("[OK] articles.json updated successfully.")
