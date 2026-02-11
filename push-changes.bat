@echo off
cd /d C:\Users\hp\Job-portle.worktrees\copilot-worktree-2026-02-11T07-00-45

echo Adding files...
git add vite-project\Dockerfile
git add job-backend\server.ts
git add vite-project\nginx-ssl.conf
git add IMAGE_FIX_GUIDE.md

echo Committing changes...
git commit -m "Fix: Proxy uploads through backend and update nginx config"

echo Pulling latest changes...
git pull origin anjali --rebase

echo Pushing to remote...
git push origin HEAD:anjali

echo Done!
pause
