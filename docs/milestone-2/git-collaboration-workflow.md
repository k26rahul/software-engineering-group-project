# Git & Collaboration Workflow

This document defines how our team of 5 collaborates using Git and our project board, from initial setup through daily feature work. It also includes a quick Git command reference and general do's/don'ts. This is an internal working document, not a milestone deliverable.

---

## 1. Core Branching Rule: One Branch, One Feature, One Owner

- Every feature/backlog item gets its **own branch**, created from the latest `main`.
- At any given moment, a branch has **exactly one owner** actively working on it — branches are never shared between two people simultaneously. This is what actually prevents most conflicts, not the branch itself.
- A feature is expected to take **2–3 days**, resulting in roughly **2–5 commits** (commits should represent logical, meaningful steps — not a fixed quota).
- Over the course of the 15-day sprint, a single person will work through **multiple backlogs sequentially** (5–10 total), but only one branch should be "in flight" for a person at a time to avoid split focus and stale branches.

### Branch Naming

Use a consistent, descriptive pattern so anyone can tell what a branch is for at a glance:

```
feature/<short-description>
```

Example: `feature/catalog-search-page`, `feature/issue-return-flow`

### Lifecycle of a Feature Branch

1. Pull the latest `main`.
2. Create a new branch off `main` for your assigned backlog item.
3. Work locally, committing in small, meaningful chunks.
4. **1–2 times a day**, pull the latest `main` into your branch to stay in sync and catch conflicts early, while they're small and easy to resolve.
5. Before opening a Pull Request, pull `main` into your branch **one final time**, resolve any conflicts locally, and confirm everything still works.
6. Push your branch to GitHub and open a Pull Request into `main`.
7. Get the required approvals (see Branch Protection below), address review comments.
8. Merge into `main` (prefer **squash merge** — collapses your 2–5 commits into one clean commit on `main`, keeping the mainline history readable).
9. Delete the feature branch after merging — it has served its purpose.

---

## 2. Branch Protection Rules

Configured on GitHub for the `main` branch:

- **No direct pushes to `main`** — all changes must go through a Pull Request.
- **Minimum 2 approvals** required before a PR can be merged.
- **Status checks must pass** — the GitHub Actions lint/format checks (and tests, once in place) must succeed before merge is allowed.
- Feature branches should be **deleted after merge** to keep the repository clean.

---

## 3. Getting Started: Version 0 (Skeleton)

Before backlog work begins, **Rahul** will set up **Version 0** — the initial skeleton of the application. This is a one-time setup phase, not feature work.

**Version 0 includes:**

- Base folder structure for both frontend and backend.
- Frontend: Vite project initialized, Tailwind + shadcn/ui configured, dependencies installed, a couple of basic pages/components wired up (just enough to prove the setup works).
- Backend: FastAPI project initialized, SQLModel + SQLite configured, dependencies installed, a couple of basic routers/services wired up end-to-end.
- ESLint/Prettier/Ruff configs in place, GitHub Actions CI configured.

**Version 0 explicitly does NOT include:** any real feature implementation. It's purely scaffolding so that everyone can branch off a working baseline instead of an empty repository.

Once Version 0 is merged into `main`, backlog work begins.

---

## 4. Project Board & Backlog Workflow

Our project board currently has 3 columns: **To Do → In Progress → Done**. We are adding a new column **at the very start**:

```
Backlog → To Do → In Progress → Done
```

### How it works

1. Once Version 0 is complete, the team reviews the Milestone 2 system design (modules, components, data models) and breaks the **entire frontend scope** into **20–40 small backlog cards**, placed in the **Backlog** column.
2. Backlog items should be **small, self-contained, and time-boxed** — roughly a 2–3 day effort each (e.g., "Build CatalogSearchPage with filters," "Build IssuePage flow," "Build BudgetProgressBar + BudgetTrackerPage").
3. When someone is ready to start new work, a card is moved from **Backlog → To Do** and **assigned to one person** — that person is the sole owner of that card until it's done.
4. When work actually begins, the card moves to **In Progress**, and a feature branch is created for it.
5. Once merged into `main`, the card moves to **Done**.

### Capacity Planning

- **Team size:** 5 people
- **Timeline:** July 4 → July 22 (≈15 days)
- **Target:** At least 80% of the frontend scope complete by the deadline
- **Total backlogs:** 20–40, split across the team → roughly **5–10 backlogs per person**

This is our first time practicing this exact workflow as a team — we'll adjust backlog sizing/estimates as we go if 2–3 days turns out to be too optimistic or too conservative.

---

## 5. Using AI Agents for Development

The team's job is **thinking, planning, and reviewing**. The labor of writing code is offloaded to AI agents — but AI output is held to the same quality bar as human-written code, if not higher, since it must be actively verified.

- **Automated linting/formatting is the bare minimum**, not a substitute for review. Every AI-generated change must be reviewed for correctness, adherence to our component design, and overall code quality before a PR is raised.
- **Scaffolding / starting new work:** use the most capable frontier model available to you (e.g., Claude Sonnet/Opus 4.x) to get a strong first draft and correct structure.
- **Smaller, focused tasks:** lighter models (e.g., Gemini Flash/Pro) are sufficient once the pattern/structure is already established.
- Everyone is encouraged to use the best model they have access to — prefer quality over speed when token budget allows.
- We will maintain a set of **repository-level rules/skills** for AI agents (coding conventions, architectural boundaries like routers/services/models, styling conventions) to keep AI output consistent across the team and reduce review overhead over time.

---

## 6. Git Quick Reference

A few core concepts first, then commands grouped by task. These aren't meant to be memorized — treat this as a lookup table.

### Concepts: Remote & Origin

- A **remote** is a reference to a copy of the repository hosted elsewhere (in our case, GitHub).
- **`origin`** is just the conventional name Git gives to the default remote when you clone a repository — it's not a special keyword, just a common alias.
- You can have multiple remotes, but for this project everyone will only work with `origin`.

| Command                  | What it does                                                   |
| ------------------------ | -------------------------------------------------------------- |
| `git remote -v`          | Lists configured remotes and their URLs (fetch/push)           |
| `git remote show origin` | Shows detailed info about `origin`, including tracked branches |

---

### Cloning & Branching

| Command                           | What it does                                            |
| --------------------------------- | ------------------------------------------------------- |
| `git clone <url>`                 | Copies a remote repository to your machine              |
| `git branch`                      | Lists local branches                                    |
| `git branch -a`                   | Lists local **and** remote-tracking branches            |
| `git branch <name>`               | Creates a new branch (doesn't switch to it)             |
| `git checkout <name>`             | Switches to an existing branch                          |
| `git checkout -b <name>`          | Creates a new branch **and** switches to it in one step |
| `git switch <name>`               | Modern alternative to `checkout` for switching branches |
| `git switch -c <name>`            | Modern alternative to `checkout -b`                     |
| `git branch -d <name>`            | Deletes a local branch (safe — refuses if unmerged)     |
| `git branch -D <name>`            | Force-deletes a local branch, even if unmerged          |
| `git push origin --delete <name>` | Deletes a branch on GitHub                              |

---

### Status & Log (checking where you stand)

| Command                           | What it does                                                                                              |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `git status`                      | Full status: current branch, staged/unstaged/untracked files                                              |
| `git status -s`                   | Short, compact status output (one line per file)                                                          |
| `git log`                         | Full commit history with author, date, message                                                            |
| `git log --oneline`               | Condensed history — one line per commit (hash + message)                                                  |
| `git log --oneline --graph --all` | One-line history with a branch graph, across all branches — great for visualizing where branches diverged |
| `git diff`                        | Shows unstaged changes                                                                                    |
| `git diff --staged`               | Shows changes that are staged but not yet committed                                                       |

---

### Staging & Committing

| Command                        | What it does                                                                                              |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `git add <file>`               | Stages a specific file                                                                                    |
| `git add .`                    | Stages all changed files in the current directory                                                         |
| `git commit -m "message"`      | Commits staged changes with a message                                                                     |
| `git commit -am "message"`     | Stages **all tracked, modified** files and commits in one step (skips new/untracked files)                |
| `git commit --amend`           | Edits the most recent commit (message and/or staged changes) — **only safe if you haven't pushed it yet** |
| `git commit --amend --no-edit` | Adds staged changes to the last commit without changing its message                                       |

---

### Syncing: Pull & Push

| Command                         | What it does                                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git fetch origin`              | Downloads latest remote data **without** merging it into your branch                                                                              |
| `git pull origin main`          | Fetches `main` and merges it into your current branch (this is "pull main into my feature branch")                                                |
| `git pull --rebase origin main` | Same as above, but replays your commits on top of `main` instead of creating a merge commit — keeps history linear (optional, use if comfortable) |
| `git push origin <branch>`      | Pushes your local branch to GitHub                                                                                                                |
| `git push -u origin <branch>`   | Pushes and sets up tracking, so future `git push`/`git pull` on this branch don't need the branch name repeated                                   |

---

### Merging

| Command                      | What it does                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `git merge <branch>`         | Merges the given branch into your current branch                                                    |
| `git merge --no-ff <branch>` | Forces a merge commit even if a fast-forward is possible — preserves the fact that a branch existed |

---

### Stashing (temporarily shelving work)

| Command           | What it does                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `git stash`       | Temporarily saves uncommitted changes and reverts your working directory to the last commit |
| `git stash list`  | Shows all stashed change sets                                                               |
| `git stash pop`   | Re-applies the most recent stash and removes it from the stash list                         |
| `git stash apply` | Re-applies the most recent stash but **keeps** it in the stash list                         |
| `git stash drop`  | Deletes a stash without applying it                                                         |

Useful when you need to quickly switch branches (e.g., to pull `main`) without committing half-finished work.

---

### Squashing

| Command                   | What it does                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `git rebase -i HEAD~<n>`  | Opens an interactive rebase for the last `n` commits, letting you squash/reorder/reword them locally                                        |
| Squash merge on GitHub PR | The team's preferred way to squash — collapses an entire PR's commits into a single commit on `main` automatically, no manual rebase needed |

---

### Scenario: Pushing a Feature Branch, Opening a PR, and Local Cleanup

This is the standard workflow when you have accumulated commits on your local feature branch (`feature/<branch-name>`) and are ready to push, submit a pull request, and clean up your workspace:

#### 1. Push changes and open PR
Starting on your feature branch with accumulated commits:
1. Push the branch to GitHub:
   ```bash
   git push -u origin feature/<branch-name>
   ```
2. Go to GitHub and open a Pull Request.

#### 2. Clean up locally after merge
After the Pull Request is merged on GitHub and the remote branch has been deleted:
1. Switch back to your local `main` branch:
   ```bash
   git checkout main
   ```
2. Pull the newly merged changes to update local `main`:
   ```bash
   git pull origin main
   ```
3. Delete the local feature branch:
   ```bash
   git branch -d feature/<branch-name>
   ```
4. Prune obsolete remote-tracking branch references:
   ```bash
   git fetch --prune
   ```

---

## 7. If Something Breaks

If you hit a confusing Git state (conflicts you don't understand, a broken branch, accidental force-push, detached HEAD, etc.):

**Stop. Do not run random commands hoping to fix it.** Git mistakes compound quickly, especially with force operations. Reach out to the team immediately — we fix it together, calmly, by understanding what happened first.

---

## 8. Do's and Don'ts

### Do

- Pull `main` into your feature branch at least once a day.
- Keep feature branches short-lived (2–3 days) and scoped to one backlog item.
- Write clear, meaningful commit messages.
- Review AI-generated code as critically as you would review a teammate's code.
- Delete your branch after it's merged.
- Ask for help the moment something in Git feels confusing or wrong.
- Keep PRs small enough that two reviewers can actually review them properly.

### Don't

- Don't push directly to `main` — it's protected, but don't even try.
- Don't work on someone else's branch without coordinating first.
- Don't `git push --force` on a shared branch (only ever safe on your own, unshared feature branch, and only if you know why you're doing it).
- Don't sit on a feature branch for a week without syncing with `main`.
- Don't merge your own PR without the required approvals.
- Don't treat passing lint checks as "good enough" — it's the floor, not the bar.
- Don't panic and start running commands blindly when something breaks — pause and ask the team.
