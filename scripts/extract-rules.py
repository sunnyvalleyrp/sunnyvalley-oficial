import json
import re
import sys

from docx import Document


def clean_public_text(text: str) -> str:
    replacements = {
        "Salty Whale.": "Restaurantes locais.",
        "Salty Whale": "restaurantes locais",
        "o sanduíche de lagosta": "a gastronomia local",
        "prove o sanduíche de lagosta": "conheça a gastronomia local",
    }
    for original, replacement in replacements.items():
        text = text.replace(original, replacement)
    return " ".join(text.split())


def split_rule(text: str, index: int) -> tuple[str, str]:
    numbered = re.match(r"^(\d+)\.\s+(.+)$", text)
    if numbered:
        return f"Regra rápida {numbered.group(1)}", numbered.group(2)

    first, separator, rest = text.partition(". ")
    if separator and len(first) <= 78:
        return first, rest

    return f"Orientação {index}", text


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("uso: extract-rules.py entrada.docx saida.json")

    document = Document(sys.argv[1])
    current_group = ""
    current_subgroup = ""
    started = False
    rules = []
    counters: dict[str, int] = {}

    for paragraph in document.paragraphs:
        text = clean_public_text(paragraph.text.strip())
        if not text:
            continue

        style = paragraph.style.name
        if style == "Heading 1":
            if text.startswith("1. Identidade"):
                started = True
            if not started:
                continue
            current_group = text
            current_subgroup = ""
            counters.setdefault(current_group, 0)
            continue

        if not started:
            continue

        if style == "Heading 2":
            current_subgroup = text
            continue

        if text.startswith("FIM DO DOCUMENTO"):
            break

        counters[current_group] += 1
        title, body = split_rule(text, counters[current_group])
        rules.append(
            {
                "group": current_group,
                "subgroup": current_subgroup,
                "title": title,
                "text": body,
            }
        )

    with open(sys.argv[2], "w", encoding="utf-8") as output:
        json.dump(rules, output, ensure_ascii=False, indent=2)
        output.write("\n")

    print(f"{len(rules)} itens exportados")


if __name__ == "__main__":
    main()
