---
description: Workflow to initialize and push code to GitHub
---

1. Initialize Git (if not already initialized)
   // turbo
   git init

2. Create/Check .gitignore
   Ensure a .gitignore file exists and includes common exclusions (e.g., .DS_Store, node_modules, .agent, .gemini).

3. Stage All Changes
   // turbo
   git add .

4. Check Status
   git status

5. Commit Changes
   git commit -m "Update project: [Add brief description]"

6. Setup Remote (if not set)
   git remote -v

   # If empty, ask user: "git remote add origin <URL>"

7. Push to GitHub
   git branch -M main
   git push -u origin main
