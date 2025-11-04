# Quick Deployment Checklist ✅

Follow these steps in order:

## ☐ 1. MongoDB Atlas Setup (5 minutes)
- [ ] Create account at mongodb.com/cloud/atlas
- [ ] Create free M0 cluster
- [ ] Create database user (save username & password!)
- [ ] Allow access from anywhere (0.0.0.0/0)
- [ ] Get connection string
- [ ] Replace <username> and <password>
- [ ] Add `/cricket-teams` to end of connection string

**Your MongoDB URI should look like:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cricket-teams?retryWrites=true&w=majority
```

---

## ☐ 2. Push to GitHub (2 minutes)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

## ☐ 3. Deploy to Vercel (3 minutes)
- [ ] Go to vercel.com/login
- [ ] Sign in with GitHub
- [ ] Import your repository
- [ ] Add environment variable: `MONGODB_URI` = your connection string
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete

---

## ☐ 4. Setup Vercel Blob (2 minutes)
- [ ] In Vercel project, go to "Storage" tab
- [ ] Create new Blob storage
- [ ] Copy the `BLOB_READ_WRITE_TOKEN`
- [ ] Go to Settings → Environment Variables
- [ ] Add: `BLOB_READ_WRITE_TOKEN` = your token
- [ ] Redeploy the project

---

## ☐ 5. Test Your App
- [ ] Visit your-project-name.vercel.app
- [ ] Create a test team
- [ ] Upload a team logo (tests Blob storage)
- [ ] Add a player
- [ ] Export to Excel
- [ ] Everything works? 🎉

---

## Environment Variables Needed

```env
MONGODB_URI=mongodb+srv://...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

---

## Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions with screenshots.

---

**Estimated Total Time: 15 minutes**

Once complete, your app will be live at: `https://your-project-name.vercel.app` 🚀
