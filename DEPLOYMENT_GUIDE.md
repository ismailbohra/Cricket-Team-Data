# Vercel Deployment Guide for Cricket Team Management App

## Prerequisites

Before deploying, you need:
1. A Vercel account (free tier is sufficient)
2. MongoDB Atlas database (free tier)
3. Your code pushed to GitHub/GitLab/Bitbucket

## Step-by-Step Deployment Process

### Step 1: Set Up MongoDB Atlas (Free Tier)

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select a cloud provider and region (choose one close to you)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for Vercel)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with your credentials
   - Add database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cricket-teams?retryWrites=true&w=majority`

### Step 2: Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Create .gitignore
echo "node_modules
.next
.env.local
.DS_Store
*.log" > .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit - Cricket Team Management App"

# Create GitHub repository and push
# Go to github.com and create a new repository
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. **Sign in to Vercel**
   - Go to: https://vercel.com/login
   - Sign in with GitHub (recommended)

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   **MONGODB_URI**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cricket-teams?retryWrites=true&w=majority
   ```
   *(Use your actual MongoDB connection string)*

   **Note:** Don't add BLOB_READ_WRITE_TOKEN yet - we'll get it after deployment

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment

### Step 4: Set Up Vercel Blob Storage

1. **Go to Your Project in Vercel**
   - Click on your deployed project

2. **Create Blob Storage**
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Blob"
   - Name it (e.g., "cricket-images")
   - Click "Create"

3. **Get the Token**
   - After creation, go to the Blob storage
   - Go to "Settings" tab
   - Copy the `BLOB_READ_WRITE_TOKEN`

4. **Add Token to Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add new variable:
     - Key: `BLOB_READ_WRITE_TOKEN`
     - Value: *paste your token*
   - Select all environments (Production, Preview, Development)
   - Click "Save"

5. **Redeploy**
   - Go to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Click "Redeploy"
   - Wait for redeployment

### Step 5: Test Your Application

1. **Access Your App**
   - Your app will be at: `https://your-project-name.vercel.app`

2. **Test Features**
   - Create a team
   - Add players
   - Upload images (this tests Blob storage)
   - Export to Excel
   - Set batting order

### Step 6: (Optional) Custom Domain

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

## Environment Variables Summary

Make sure you have these in Vercel:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cricket-teams?retryWrites=true&w=majority
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Make sure all dependencies are in `package.json`
- Try building locally: `npm run build`

### Database Connection Error
- Verify MongoDB connection string
- Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0)
- Ensure database user has correct permissions

### Image Upload Fails
- Verify BLOB_READ_WRITE_TOKEN is set
- Check Blob storage is created
- Redeploy after adding the token

### "Cannot find module" errors
- Make sure all imports use correct paths
- Check that all files are committed to Git

## Updating Your Application

After making changes:

```bash
# Commit changes
git add .
git commit -m "Your change description"
git push

# Vercel will automatically deploy the changes
```

## Monitoring

1. **View Logs**
   - Go to Vercel Dashboard → Your Project → Logs
   - See real-time logs

2. **Analytics**
   - Go to Vercel Dashboard → Your Project → Analytics
   - See visitor statistics

## Cost

- **Vercel**: Free tier includes:
  - 100 GB bandwidth
  - Unlimited personal projects
  - Automatic HTTPS

- **MongoDB Atlas**: Free tier includes:
  - 512 MB storage
  - Shared RAM
  - Perfect for small apps

- **Vercel Blob**: Free tier includes:
  - 500 MB storage
  - 1 GB bandwidth/month

## Support

If you run into issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Test MongoDB connection separately

## Your Live Application

Once deployed, your app will be accessible at:
- **URL**: `https://your-project-name.vercel.app`
- **Teams Page**: `https://your-project-name.vercel.app/teams`

Share this URL with others to access your cricket team management system!

---

**Next Steps After Deployment:**
1. Test all features
2. Create your first team
3. Add some players
4. Share the URL with your team
5. (Optional) Set up custom domain

Congratulations! Your app is now live! 🏏🎉
