import json
import os
import random
import sys


def analyse(path):
    # TODO: replace with the real artificial-RIR detection.
    score = round(random.uniform(0, 100), 1)
    return {
        "filename": os.path.basename(path),
        "sizeBytes": os.path.getsize(path),
        "manipulated": score >= 50,  # True = artificial RIR
        "score": score,  
    }


def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: analyse.py <audio_file>"}))
        return 2
    try:
        print(json.dumps(analyse(sys.argv[1])))
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
