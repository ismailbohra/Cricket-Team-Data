# 🚀 Quick Deploy to Vercel

## Option 1: Deploy via Vercel CLI (Fastest - 5 minutes)

### Install Vercel CLI
```powershell
npm install -g vercel
```

### Deploy
```powershell
# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Add environment variables when prompted or after deployment
```

### Add Environment Variables
After deployment, add these:
```powershell
vercel env add MONGODB_URI
# Paste your MongoDB connection string

vercel env add BLOB_READ_WRITE_TOKEN
# Get this from Vercel Dashboard → Storage → Create Blob → Copy token
```

Then redeploy:
```powershell
vercel --prod
```

---

## Option 2: Deploy via GitHub (Recommended - 15 minutes)

### 1. Push to GitHub
```powershell
# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Cricket Team Management App"

# Create GitHub repo and push
# (Create repo at github.com first)
git remote add origin https://github.com/YOUR_USERNAME/cricket-team-data.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - Framework: Next.js ✓
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Add Environment Variables
In Vercel project settings, add:
- `MONGODB_URI` = Your MongoDB connection string
- `BLOB_READ_WRITE_TOKEN` = Get from Vercel Storage

### 4. Create Vercel Blob Storage
1. Go to your project → Storage tab
2. Create Blob storage
3. Copy token
4. Add to environment variables
5. Redeploy

---

## MongoDB Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/cricket-teams?retryWrites=true&w=majority
```

Replace:
- `USERNAME` with your MongoDB username
- `PASSWORD` with your MongoDB password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

---

## Verification Steps

After deployment, test:
- ✅ Visit your app URL
- ✅ Create a team
- ✅ Upload a logo
- ✅ Add players
- ✅ Export to Excel
- ✅ Set batting order

---

## Troubleshooting

### Build fails?
```powershell
# Test build locally first
npm run build
```

### Can't connect to MongoDB?
- Check connection string format
- Verify MongoDB Atlas allows all IPs (0.0.0.0/0)
- Ensure database user has read/write permissions

### Images not uploading?
- Verify `BLOB_READ_WRITE_TOKEN` is set in Vercel
- Check Blob storage is created
- Redeploy after adding token

---

## Your App URL

After deployment: `https://YOUR-PROJECT-NAME.vercel.app`

---

## Need More Help?

See detailed guides:
- `DEPLOYMENT_CHECKLIST.md` - Step by step checklist
- `DEPLOYMENT_GUIDE.md` - Complete guide with explanations

---

**Total Time: 15 minutes** ⏱️

Good luck! 🏏✨
