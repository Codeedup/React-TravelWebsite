import json
from pathlib import Path


NOTEBOOK_PATH = Path(__file__).with_name("server.ipynb")


def main():
    notebook = json.loads(NOTEBOOK_PATH.read_text(encoding="utf-8"))
    source = "".join(notebook["cells"][1]["source"])
    exec(compile(source, str(NOTEBOOK_PATH), "exec"), {"__name__": "__main__"})


if __name__ == "__main__":
    main()
