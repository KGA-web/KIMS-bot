# KIMS AI Bot — Staging & Pre-production Guide

To comply with the requirement for a dedicated **Staging Environment**, follow these steps to use Vercel's built-in preview and environment management features.

## 1. Setup Staging in Vercel
1. Go to your **Vercel Dashboard** -> **Settings** -> **Git**.
2. Under **Production Branch**, ensure it is set to `main`.
3. Under **Deployments**, enable "Automatically assign a domain to the newest deployment".

## 2. Environment Variables for Staging
1. Go to **Settings** -> **Environment Variables**.
2. Add your `GROQ_API_KEY` and `GROQ_MODEL`.
3. Under **Environments**, select **Staging** and **Preview** (in addition to Production).
4. This ensures that any branch other than `main` uses these variables for testing.

## 3. Workflow
- **Development**: Create a new branch (e.g., `staging` or `dev`).
- **Review**: Every push to this branch will generate a unique URL (e.g., `kims-bot-git-staging.vercel.app`) for testing.
- **Deploy**: Merge the branch into `main` only after verified in the Staging URL.

## 4. Staging Bot URL
Once the branch is pushed, your staging domain will look like:
`https://kims-bot-staging.vercel.app` (if assigned).

This allows you to test new knowledge base updates or UI changes without affecting the live bot on `kimsbengaluru.edu.in`.
