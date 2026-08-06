import subprocess
from InquirerPy import inquirer

PROFILES = {
    "Rahul Maurya": {
        "name": "Rahul Maurya",
        "email": "78677484+k26rahul@users.noreply.github.com",
    },
    "vidhatrihr": {
        "name": "vidhatrihr",
        "email": "167363972+vidhatrihr@users.noreply.github.com",
    },
    "Bharat Choudhary": {
        "name": "Bharat Choudhary",
        "email": "93582493+23f1000879@users.noreply.github.com",
    },
    "Taniya Gupta": {
        "name": "Taniya Gupta",
        "email": "137302901+22f3000586@users.noreply.github.com",
    },
    "Harikesh Shukla": {
        "name": "Harikesh Shukla",
        "email": "82894061+k25harikesh@users.noreply.github.com",
    },
}


import sys


def get_git_config(key: str) -> str:
    try:
        return subprocess.check_output(["git", "config", key], text=True).strip()
    except subprocess.CalledProcessError:
        return ""


def set_git_config(key: str, value: str):
    subprocess.run(["git", "config", key, value], check=True)


def main():
    current_name = get_git_config("user.name")
    current_email = get_git_config("user.email")

    if len(sys.argv) > 1:
        target = sys.argv[1].strip()
        matched_key = None
        for key in PROFILES:
            if key.lower() == target.lower():
                matched_key = key
                break

        if not matched_key:
            print(f"Profile '{target}' not found. Available profiles: {list(PROFILES.keys())}")
            sys.exit(1)

        profile = PROFILES[matched_key]
        set_git_config("user.name", profile["name"])
        set_git_config("user.email", profile["email"])
        print(f"Successfully updated Git profile to {profile['name']} ({profile['email']})")
        return

    print("Current Git configuration:")
    print(f"  Name:  {current_name if current_name else '<Not Set>'}")
    print(f"  Email: {current_email if current_email else '<Not Set>'}\n")

    change = inquirer.confirm(
        message="Do you want to change your Git profile?", default=False
    ).execute()
    if change:
        choices = list(PROFILES.keys())
        selected_name = inquirer.select(
            message="Choose a profile to apply:", choices=choices
        ).execute()

        profile = PROFILES[selected_name]
        set_git_config("user.name", profile["name"])
        set_git_config("user.email", profile["email"])
        print(
            f"\nSuccessfully updated Git profile to {profile['name']} ({profile['email']})"
        )


if __name__ == "__main__":
    main()

