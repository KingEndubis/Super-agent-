# python_core/git_push.py
import os, subprocess, sys

REPO_REMOTE = os.environ.get("GIT_REMOTE", "https://github.com/KingEndubis/Super-agent-.git")
TOKEN = os.environ.get("GITHUB_PUSH_TOKEN")

if not TOKEN:
    print("ERROR: GITHUB_PUSH_TOKEN not set. Set it as an env var and retry.")
    sys.exit(2)

auth_remote = REPO_REMOTE.replace("https://", f"https://{TOKEN}@")

def run(cmd, cwd=None):
    print("> " + " ".join(cmd))
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    if r.stdout:
        print(r.stdout)
    if r.stderr:
        print(r.stderr)
    return r.returncode

def main():
    # ensure git repo
    if run(["git", "status"]) != 0:
        run(["git", "init"])
    run(["git", "add", "."])
    run(["git", "commit", "-m", "Auto commit from Super Agent"] )
    run(["git", "remote", "remove", "origin"], cwd=None)
    run(["git", "remote", "add", "origin", auth_remote])
    run(["git", "branch", "-M", "main"])
    rc = run(["git", "push", "-u", "origin", "main", "--force"])
    if rc == 0:
        print("Push successful")
    else:
        print("Push failed")

if __name__ == "__main__":
    main()
