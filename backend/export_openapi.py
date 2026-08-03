"""Script to export and enrich the FastAPI OpenAPI schema into openapi.yaml with User Story mappings."""

import sys
from pathlib import Path

# Add backend directory to sys.path using pathlib.Path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import yaml
from main import app
from user_stories_map import USER_STORIES, USER_STORY_MAP


def generate_enriched_openapi() -> dict:
    """Generates the OpenAPI spec dictionary enriched with user story mappings."""
    openapi_schema = app.openapi()

    paths = openapi_schema.get("paths", {})
    for path_str, path_item in paths.items():
        mapped_path = USER_STORY_MAP.get(path_str, {})
        for method_str, operation in path_item.items():
            if method_str.lower() in ("get", "post", "put", "patch", "delete"):
                story_ids = mapped_path.get(method_str.lower(), [])
                if story_ids:
                    operation["x-user-story-ids"] = story_ids

                    # Build story descriptions dynamically from USER_STORIES dictionary
                    stories = [f"{sid}: {USER_STORIES[sid]}" for sid in story_ids if sid in USER_STORIES]
                    if stories:
                        current_desc = operation.get("description", "")
                        stories_formatted = "\n".join(f"- {s}" for s in stories)
                        user_story_section = f"\n\n### User Story Mapping\n{stories_formatted}"
                        operation["description"] = (current_desc + user_story_section).strip()

    return openapi_schema


def export_yaml():
    """Exports the enriched OpenAPI schema to openapi.yaml inside backend directory."""
    schema = generate_enriched_openapi()

    backend_yaml_path = backend_dir / "openapi.yaml"
    with backend_yaml_path.open("w", encoding="utf-8") as f:
        yaml.dump(schema, f, sort_keys=False, allow_unicode=True)

    print(f"Successfully exported enriched OpenAPI YAML to: {backend_yaml_path}")


if __name__ == "__main__":
    export_yaml()
