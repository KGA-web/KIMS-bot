# KAIA — Koshys AI Assistant (KIMS Bengaluru) Setup Guide

## Overview
- **Platform**: Website Widget (kimsbengaluru.edu.in)
- **Data Storage**: Google Sheets
- **Tech**: Vercel + FastAPI + Groq (Llama 3.1 70B)
- **Cost**: Extremely Low/Free (using Groq free tier or low-cost API)

---

## Step 1: Deploy Backend on Vercel

1. Connect your GitHub repository (`KIMS_Bot_Repo`) to Vercel.
2. Ensure the following environment variables are set in the Vercel Dashboard ($Settings -> Environment Variables$):

| Variable | Value |
|----------|-------|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |
| `GROQ_MODEL` | `llama-3.1-70b-versatile` (or preferred model) |

---

## Step 2: Setup Google Sheets for Lead Capture

1. Create a new Google Sheet (https://sheet.new).
2. Go to `Extensions` -> `Apps Script`.
3. Paste the contents of [google_apps_script.gs](google_apps_script.gs).
4. Update the `SPREADSHEET_URL` variable in the script with your sheet's URL.
5. Click **Deploy** -> **New Deployment**.
   - **Type**: Web App
   - **Execute as**: Me
   - **Who has access**: Anyone
6. Copy the **Web App URL**.
7. In `widget.js`, update the `SHEETS_URL` with this copied URL.

---

## Step 3: Add Widget to Website

Add the following script tag before the closing `</footer>` or `</body>` tag on your website:

```html
<script src="assets/js/widget.js"></script>
```

Ensure `widget.js` is placed in the `assets/js/` directory on your server.

---

## Features

- **2026 Ready**: Updated with details for BVA Interior Design, B.Com Logistics, and Forensic Science.
- **Lead Capture**: Auto-triggers a contact form after 2 user messages.
- **Voice Support**: Integrated speech-to-text for easy interaction.
- **Glassmorphism UI**: Beautiful, responsive, and professional design.

---

## Need Help?
- **Email**: info@kgi.edu.in
- **Admin**: +91 81472 15707