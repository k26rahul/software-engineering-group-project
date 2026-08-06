# Milestone 4 - Future Agent Implementation Plan

## Context and Progress So Far
Welcome, future coding agent! Here is the story of our progress on the Software Engineering project (MAY2026-Team-052) so far.
We have successfully completed Milestone 3 and have planned out **Milestone 4: Feedback Implementation & API Finalization**.

Our recent progress:
1. **Identified Missing Routers**: Based on the project milestones and the existing frontend mocks (e.g. `frontend/src/mocks/handlers`), we identified 6 distinct backend API features remaining to be built for Sprint 2.
2. **Task Assignment**: We distributed the work among the 5 team members based on their preferences:
   - Bharat Choudhary -> Recommendations API
   - Harikesh Shukla -> Payments API
   - Vidhatri H R (vidhatrihr) -> Budget & Expense Tracking API
   - Taniya Gupta -> Purchase Requests API
   - Rahul Maurya -> Community Engagement API & Subscriptions API
3. **Issue & Milestone Creation**: We created **Milestone 4** on GitHub and logged 6 new issues detailing the work. The teammates were directly assigned to these issues via GitHub, and the issues were linked to the "SE Project Dashboard" (Project 2).
4. **Feature Branches**: We initialized a local feature branch for each issue and pushed them to the remote repository. The issue bodies have been updated to explicitly mention their respective branches.

## The Issues and Feature Branches
Here is the definitive list of issues you will be implementing:

1. **Recommendations API (COMPLETED)**
   - **Issue**: [#49](https://github.com/k26rahul/MAY2026-Team-052/issues/49)
   - **Branch**: `feature/issue-49-recommendations-api`
   - **Git Profile**: `Bharat Choudhary`

2. **Payments API (COMPLETED)**
   - **Issue**: [#50](https://github.com/k26rahul/MAY2026-Team-052/issues/50)
   - **Branch**: `feature/issue-50-payments-api`
   - **Git Profile**: `Harikesh Shukla`

3. **Budget & Expense Tracking API (COMPLETED)**
   - **Issue**: [#51](https://github.com/k26rahul/MAY2026-Team-052/issues/51)
   - **Branch**: `feature/issue-51-budget-api`
   - **Git Profile**: `vidhatrihr`

4. **Purchase Requests API (COMPLETED)**
   - **Issue**: [#52](https://github.com/k26rahul/MAY2026-Team-052/issues/52)
   - **Branch**: `feature/issue-52-purchase-requests-api`
   - **Git Profile**: `Taniya Gupta`

- [x] **5. Community Engagement API**
  - **Issue**: #53
  - **Branch**: `feature/issue-53-community-engagement-api`
  - **Git Profile**: `Rahul Maurya`
- [x] **6. Subscriptions API**
  - **Issue**: #54
  - **Branch**: `feature/issue-54-subscriptions-api`
  - **Git Profile**: `Rahul Maurya`

---

## Your Implementation Workflow
You must strictly follow this workflow for **each issue**, one by one:

### 1. Preparation
- **Understand the Requirements**: Get the information about what to do for the issue by directly requesting the issue details using the GitHub CLI (e.g., `gh issue view <issue_number>`). The GitHub CLI is properly installed and authenticated.
- Review both the backend and frontend codebases (`frontend/src/mocks/handlers` is a great place to start) to deeply understand the data structures and requirements for the feature.
- Make sure to pull the latest `main` branch before working on the next feature. Update `main` (`git checkout main`, `git pull origin main`), check out the respective feature branch (`git checkout <branch_name>`), and merge `main` into it (`git merge main`) to keep it up to date.

### 2. Set Up Identity
- You must commit code as the assigned teammate. Switch the Git profile using the provided utility script.
  ```powershell
  python private\git_profile.py "<Git Profile>"
  ```
  *(Note: Valid profiles are exactly the ones listed in the table above: "Rahul Maurya", "vidhatrihr", "Bharat Choudhary", "Taniya Gupta", "Harikesh Shukla").*
- **Verify**: Confirm the switch was successful by running `git config user.name` and `git config user.email`.

### 3. Implement the Code
- Write the necessary routes, controllers, tests, and models. 
- You must make **4 to 5 incremental commits** as you build out the feature to simulate a real developer's workflow. Write clear and descriptive commit messages.

### 4. Validation & Fixing
- Before pushing anything, trigger the validation workflow: `/validate-and-fix`.
- This workflow checks formatting, linting, and runs `pytest`.
- If you have to modify the code during validation to fix lint errors or failing tests, **make another commit** for those fixes, and re-run `/validate-and-fix` until everything passes cleanly.

### 5. Push and PR
- Once the code is complete and fully validated, push to the remote repository: `git push origin <branch_name>`.
- **PR Description**: Write the detailed PR body in a temporary markdown file first (e.g., `pr_body.md`). The body must explicitly state which issue it closes (e.g., `Closes #<issue_number>`) and detail the work that has been done.
- Create a Pull Request using the file: `gh pr create --body-file pr_body.md`.

### 6. Await Merge
- **STOP and wait for the user (`k26rahul`).** 
- The user will review the PR, merge it into `main`, and delete the remote branch. 
- Wait for explicit confirmation from the user that the PR has been successfully merged.

### 7. Clean Up
- After receiving confirmation, clean up your local environment:
  ```powershell
  git checkout main
  git pull origin main
  git branch -d <branch_name>
  git fetch --prune
  ```
- Proceed to the next issue in the list and repeat the entire workflow.
