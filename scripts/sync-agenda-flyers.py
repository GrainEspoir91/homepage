#!/usr/bin/env python3

import json
import re
import subprocess
from datetime import date
from pathlib import Path


DRIVE_PATH = "gdrive-grain:RESSOURCES/AGENDA"

AGENDA_DIR = Path("assets/agenda")
DATA_FILE = Path("assets/data/agenda.json")

PREFIX_PATTERN = re.compile(
    r"^A_VENIR(?:_|-)",
    re.IGNORECASE,
)

DATE_PATTERN = re.compile(
    r"(\d{4})_(\d{2})_(\d{2})"
    r"\.(png|jpe?g)$",
    re.IGNORECASE,
)


def sync_drive():
    AGENDA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    subprocess.run(
        [
            "rclone",
            "copy",
            DRIVE_PATH,
            str(AGENDA_DIR),
            "--include",
            "A_VENIR*.png",
            "--include",
            "A_VENIR*.jpg",
            "--include",
            "A_VENIR*.jpeg",
        ],
        check=True,
    )


def extract_date(filename):
    match = DATE_PATTERN.search(
        filename
    )

    if not match:
        return None

    year, month, day = map(
        int,
        match.group(1, 2, 3),
    )

    try:
        return date(
            year,
            month,
            day,
        )
    except ValueError:
        return None


def build_title(filename):
    stem = Path(filename).stem

    stem = re.sub(
        r"^A_VENIR(?:_|-)",
        "",
        stem,
        flags=re.IGNORECASE,
    )

    stem = re.sub(
        r"-\d{4}_\d{2}_\d{2}$",
        "",
        stem,
    )

    return (
        stem
        .replace("_", " ")
        .replace("-", " · ")
        .strip()
    )


def build_manifest():
    today = date.today()

    events = []

    for path in sorted(
        AGENDA_DIR.iterdir()
    ):
        if not path.is_file():
            continue

        if not PREFIX_PATTERN.match(
            path.name
        ):
            continue

        if path.suffix.lower() not in {
            ".png",
            ".jpg",
            ".jpeg",
        }:
            continue

        event_date = extract_date(
            path.name
        )

        if (
            event_date
            and event_date < today
        ):
            continue

        events.append(
            {
                "file":
                    f"./assets/agenda/{path.name}",

                "filename":
                    path.name,

                "title":
                    build_title(path.name),

                "date":
                    (
                        event_date.isoformat()
                        if event_date
                        else None
                    ),
            }
        )

    events.sort(
        key=lambda event: (
            event["date"] is None,
            event["date"] or "",
            event["title"],
        )
    )

    DATA_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    DATA_FILE.write_text(
        json.dumps(
            events,
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )

    return events


def main():
    print(
        "Synchronisation Drive "
        "RESSOURCES/AGENDA..."
    )

    sync_drive()

    events = build_manifest()

    print()
    print(
        f"{len(events)} événement(s) "
        "à venir détecté(s)"
    )

    for event in events:
        print(
            f"- {event['date'] or '?'} "
            f"{event['filename']}"
        )

    print()
    print(
        "Manifest généré : "
        f"{DATA_FILE}"
    )


if __name__ == "__main__":
    main()
