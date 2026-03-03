import json
from pathlib import Path

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

USERS_FILE = DATA_DIR / "users.json"
REWARDS_FILE = DATA_DIR / "rewards.json"
EMPLOYEE_FILE = DATA_DIR / "employee.json"


def read_json(file):
    file = Path(file)   # ✅ convert string → Path automatically

    if not file.exists() or file.stat().st_size == 0:
        return []

    with file.open("r", encoding="utf-8") as f:
        return json.load(f)


def write_json(file, data):
    file = Path(file)   # ✅ convert string → Path automatically
    file.parent.mkdir(parents=True, exist_ok=True)

    with file.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
