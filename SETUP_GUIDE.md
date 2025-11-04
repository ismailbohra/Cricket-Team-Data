# Cricket Team Management Application - Setup Guide

## 🎯 What You Have

A complete, production-ready Next.js application for managing cricket teams and players with the following features:

### ✅ Core Features Implemented

1. **Team Management**
   - Create, edit, and delete teams
   - Upload team logos (stored in Vercel Blob)
   - Team details: name, home city, founded year
   - Search functionality

2. **Player Management**
   - Add players individually with detailed forms
   - Bulk add multiple players at once
   - Upload player profile images
   - Player details: name, city, role, captain status, wicketkeeper status
   - Delete players

3. **Batting Order**
   - Drag-and-drop interface to set batting order
   - Visual indicators for order (1-11)
   - Save batting order to database

4. **Excel Export**
   - Export individual team data
   - Export all teams data
   - Includes all player information

5. **Image Management**
   - Upload and store images using Vercel Blob
   - Support for team logos and player images
   - Automatic image optimization

## 🚀 Quick Start

### 1. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start the service
# Connection string: mongodb://localhost:27017/cricket-teams
```

**Option B: MongoDB Atlas (Recommended for Production)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

### 2. Set Up Vercel Blob Storage

1. Go to https://vercel.com/dashboard
2. Create a new project or select existing
3. Go to Storage tab
4. Click "Create Database" → "Blob"
5. Copy the `BLOB_READ_WRITE_TOKEN` from settings

### 3. Configure Environment Variables

Update the `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string_here
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

### 4. Run the Application

```bash
npm run dev
```

Open http://localhost:3000

## 📁 Project Structure

```
cricket-team-data/
├── app/
│   ├── api/
│   │   ├── teams/
│   │   │   ├── route.ts              # GET all teams, POST new team
│   │   │   └── [id]/route.ts         # GET, PUT, DELETE team by ID
│   │   ├── players/
│   │   │   ├── route.ts              # GET all players, POST player(s)
│   │   │   ├── [id]/route.ts         # GET, PUT, DELETE player by ID
│   │   │   └── batch/route.ts        # PUT bulk update players
│   │   ├── upload/route.ts           # POST image upload
│   │   └── export/
│   │       ├── team/[id]/route.ts    # POST export team to Excel
│   │       └── all/route.ts          # POST export all teams
│   ├── teams/
│   │   ├── page.tsx                  # Teams list page
│   │   └── [id]/page.tsx             # Team detail page
│   ├── layout.tsx
│   ├── page.tsx                      # Homepage (redirects to /teams)
│   └── globals.css
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── TeamFormDialog.tsx            # Create/Edit team form
│   ├── PlayerFormDialog.tsx          # Add single player form
│   ├── BulkPlayerDialog.tsx          # Add multiple players form
│   └── BattingOrderManager.tsx       # Drag-and-drop batting order
├── models/
│   ├── Team.ts                       # Team Mongoose schema
│   └── Player.ts                     # Player Mongoose schema
├── lib/
│   ├── mongodb.ts                    # MongoDB connection utility
│   └── utils.ts                      # General utilities
├── .env.local                        # Environment variables (not in git)
├── .env.example                      # Example environment variables
└── README.md
```

## 🗄️ Database Schemas

### Team Schema
```typescript
{
  name: String (required, unique),
  logoUrl: String (optional),
  homeCity: String (optional),
  foundedYear: Number (optional, 1800-current year),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Player Schema
```typescript
{
  name: String (required),
  imageUrl: String (optional),
  city: String (optional),
  isCaptain: Boolean (default: false),
  isWicketKeeper: Boolean (default: false),
  playingRole: String (required, 'Bat' | 'Bowl' | 'A.R'),
  teamId: ObjectId (required, references Team),
  battingOrder: Number (optional, 1-11),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔌 API Endpoints

### Teams API
- **GET** `/api/teams?search=query` - Get all teams with optional search
- **POST** `/api/teams` - Create new team
  ```json
  {
    "name": "Team Name",
    "logoUrl": "https://...",
    "homeCity": "City",
    "foundedYear": 2020
  }
  ```
- **GET** `/api/teams/[id]` - Get team by ID
- **PUT** `/api/teams/[id]` - Update team
- **DELETE** `/api/teams/[id]` - Delete team (also deletes all players)

### Players API
- **GET** `/api/players?teamId=id&search=query` - Get players
- **POST** `/api/players` - Create player(s)
  ```json
  // Single player
  {
    "name": "Player Name",
    "teamId": "team_id",
    "playingRole": "Bat",
    "isCaptain": false,
    "isWicketKeeper": false,
    "city": "City",
    "battingOrder": 1
  }
  
  // Bulk players (array)
  [
    { "name": "Player 1", "teamId": "id", "playingRole": "Bat" },
    { "name": "Player 2", "teamId": "id", "playingRole": "Bowl" }
  ]
  ```
- **GET** `/api/players/[id]` - Get player by ID
- **PUT** `/api/players/[id]` - Update player
- **DELETE** `/api/players/[id]` - Delete player
- **PUT** `/api/players/batch` - Bulk update players
  ```json
  [
    { "_id": "id1", "battingOrder": 1 },
    { "_id": "id2", "battingOrder": 2 }
  ]
  ```

### Upload API
- **POST** `/api/upload` - Upload image
  - Content-Type: multipart/form-data
  - Field: file
  - Max size: 5MB
  - Returns: `{ url, pathname, contentType }`

### Export API
- **POST** `/api/export/team/[id]` - Export team to Excel
- **POST** `/api/export/all` - Export all teams to Excel

## 🎨 UI Components

### Pages
1. **Teams List** (`/teams`)
   - Grid view of all teams
   - Search bar
   - Add Team button
   - Export All button
   - Click team to view details

2. **Team Detail** (`/teams/[id]`)
   - Team information header
   - List of players
   - Add Player button
   - Add Bulk Players button
   - Batting Order button
   - Export to Excel button
   - Edit Team button
   - Delete Team button

### Dialogs
1. **Team Form Dialog** - Create/Edit team
2. **Player Form Dialog** - Add single player
3. **Bulk Player Dialog** - Add multiple players
4. **Batting Order Manager** - Drag-and-drop interface

## 🛠️ Technologies Used

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Vercel Blob** - Image storage
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **@dnd-kit** - Drag and drop
- **xlsx** - Excel export
- **Lucide React** - Icons

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `MONGODB_URI`
   - `BLOB_READ_WRITE_TOKEN`
6. Click "Deploy"

Your app will be live at `https://your-app.vercel.app`

### Environment Variables for Production

In Vercel Dashboard → Settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cricket-teams
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
```

## 📝 Usage Guide

### Creating Your First Team
1. Navigate to http://localhost:3000 (redirects to /teams)
2. Click "Add Team"
3. Enter team name (required)
4. Optional: Upload logo, add home city, founded year
5. Click "Create"

### Adding Players
**Single Player:**
1. Click on a team
2. Click "Add Player"
3. Fill in details (name and role required)
4. Toggle captain/wicketkeeper if needed
5. Optional: Upload profile image
6. Click "Add Player"

**Bulk Players:**
1. Click "Add Bulk Players"
2. Fill in player details in the form rows
3. Click "Add New Player" for more rows
4. Click "Add All Players"

### Setting Batting Order
1. Go to team detail page
2. Click "Batting Order"
3. Drag players to reorder (first 11 get batting order)
4. Click "Save Batting Order"

### Exporting Data
- Team page: Click "Export to Excel" for that team
- Teams list: Click "Export All" for all teams

## 🔧 Customization

### Adding New Fields to Team
1. Update `models/Team.ts`
2. Update `app/api/teams/route.ts`
3. Update `components/TeamFormDialog.tsx`

### Adding New Fields to Player
1. Update `models/Player.ts`
2. Update `app/api/players/route.ts`
3. Update player form components

### Changing Styles
- Global styles: `app/globals.css`
- Component styles: Tailwind classes in components
- Theme: `components.json` for shadcn/ui

## ⚠️ Important Notes

1. **MongoDB Connection**: Make sure MongoDB is running and accessible
2. **Vercel Blob**: Required for image uploads to work
3. **Image Size**: Maximum 5MB per image
4. **Batting Order**: Only first 11 players get batting order
5. **Captain**: Only one captain per team (auto-updates when changing)

## 🐛 Troubleshooting

### Database Connection Issues
```
Error: Cannot connect to MongoDB
```
- Check MONGODB_URI in .env.local
- Ensure MongoDB is running (if local)
- Check network access in MongoDB Atlas

### Image Upload Issues
```
Error: Failed to upload image
```
- Check BLOB_READ_WRITE_TOKEN in .env.local
- Ensure file is under 5MB
- Check file is an image type

### Build Errors
```
Module not found errors
```
- Run `npm install`
- Delete `.next` folder and rebuild
- Check all imports are correct

## 📚 Next Steps

### Potential Enhancements
1. Player statistics tracking
2. Match scheduling and results
3. Team comparison view
4. Authentication and user management
5. Dark mode support
6. Image cropping tool
7. Duplicate player detection
8. Player search and filters
9. Export to PDF
10. Mobile app version

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Support

For issues and questions, please check:
- MongoDB docs: https://docs.mongodb.com/
- Next.js docs: https://nextjs.org/docs
- Vercel Blob docs: https://vercel.com/docs/storage/vercel-blob

Happy coding! 🏏
