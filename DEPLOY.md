# 🚀 AKITAMUSIC Deployment Guide

## Step 1 — Push to GitHub

1. Create a new repo on [github.com](https://github.com/new)
2. Upload this entire `bot/` folder as the repo root (or push via Git):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/akitamusic.git
   git push -u origin main
   ```

---

## Step 2 — Deploy on Render

1. Go to **[render.com](https://render.com)** → Sign in → **New → Web Service**
2. Connect your GitHub repo
3. Render will auto-detect `render.yaml` — click **Approve**
4. Set the following **Environment Variables** in Render dashboard:

| Variable | Value | Required |
|---|---|---|
| `BOT_TOKEN` | Your Telegram bot token from [@BotFather](https://t.me/BotFather) | ✅ Yes |
| `MONGODB_URI` | Your MongoDB Atlas connection string | ✅ Yes |
| `ADMIN_ID` | Your Telegram numeric user ID | ✅ Yes |
| `BOT_USERNAME` | Your bot's username (without @) | ✅ Yes |
| `BOT_PREFIX` | Command prefix (default: `)`) | Optional |

5. Click **Create Web Service** → Wait for build to finish (2–3 min)
6. Your bot URL will be: `https://akitamusic-bot.onrender.com` (copy this!)

> **Note:** On Render free tier, the service sleeps after 15 min of inactivity.
> The Cloudflare Worker (Step 3) fixes this by pinging it every 5 minutes.

---

## Step 3 — Cloudflare Uptime Pinger (Keep-Alive)

This stops Render from sleeping your bot.

1. Go to **[workers.cloudflare.com](https://workers.cloudflare.com/)** → Sign in (free account works)
2. Click **Create Worker**
3. Replace the default code with the contents of **`cloudflare-uptime-worker.js`**
4. Click **Deploy**
5. Go to **Settings → Variables** → Add:
   - Name: `RENDER_URL`
   - Value: `https://akitamusic-bot.onrender.com` ← your Render URL
6. Go to **Triggers → Cron Triggers** → Add cron: `*/5 * * * *`
7. Save & Deploy ✅

Your bot will now be pinged every 5 minutes and stay online 24/7.

---

## Bot Commands Reference

| Command | Description |
|---|---|
| `)start` | Start / welcome message |
| `)help` | List all commands |
| `)sing` | Play music |
| `)album` | Browse albums |
| `)ping` | Check bot latency |
| `)uptime` | Show bot uptime |
| `)info` | Bot information |
| `)pfp` | Profile picture tools |
| `)quiz` | Start a quiz |
| `)tiktok` | TikTok downloader |
| `)alldl` | Universal downloader |
| `)font` | Text font changer |
| `)pinterest` | Pinterest search |
| `)anisearch` | Anime search |
| `)anihot` | Trending anime |
| `)bby` | Baby generator |
| `)catbox` | Upload to Catbox |
| `)imgur` | Upload to Imgur |
| `)pastebin` | Upload to Pastebin |
| `)midjourney` | AI image generation |
| `)prompt` | AI prompt tools |
| `)uid` | Get user ID |
| `)prefix` | Change prefix (admin) |
| `)admin` | Admin panel |
| `)cpanel` | Control panel |
| `)adduser` | Add user (admin) |
| `)whitelist` | Whitelist management |
| `)blackmarket` | Black market shop |
| `)welcome` | Welcome message setup |
| `)role` | Role management |
| `)kick` | Kick user (admin) |
| `)unsend` | Unsend message |
| `)restart` | Restart bot (admin) |
| `)eval` | Execute code (owner) |

---

## Troubleshooting

**Bot not responding?**
- Check Render logs for errors
- Make sure `BOT_TOKEN` is set correctly
- Ensure `MONGODB_URI` is reachable

**409 Conflict error?**
- Only one instance of the bot should run at a time
- The bot auto-recovers from 409 errors after 20 seconds

**MongoDB connection failed?**
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- (Render IPs change, so you need to allow all IPs)

**Render service sleeping despite Cloudflare Worker?**
- Make sure the Cron Trigger is set to `*/5 * * * *`
- Check the Worker's real-time logs under **Cloudflare → Workers → your-worker → Logs**
