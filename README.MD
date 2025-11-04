# Cricket Team Management Application

A comprehensive Next.js application for managing cricket teams and players with MongoDB database and blob storage for images.

## Features

- **Team Management**: Create, edit, delete teams with logo uploads
- **Player Management**: Add players individually or in bulk with profile images
- **Batting Order**: Drag-and-drop interface to set batting order
- **Excel Export**: Export team data to Excel files
- **Image Storage**: Upload and store team logos and player images using Vercel Blob
- **Search & Filter**: Search teams and players
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: MongoDB with Mongoose
- **Image Storage**: Vercel Blob Storage
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Excel Export**: xlsx library
- **Drag & Drop**: @dnd-kit

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Vercel Blob Storage token (for image uploads)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/cricket-teams

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

See `.env.example` for more details.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cricket-team-data/
├── app/
│   ├── api/              # API routes
│   │   ├── teams/        # Team CRUD
│   │   ├── players/      # Player CRUD
│   │   ├── upload/       # Image upload
│   │   └── export/       # Excel export
│   ├── teams/            # Teams pages
│   └── page.tsx          # Homepage
├── components/           # React components
├── models/               # Mongoose models
├── lib/                  # Utilities
└── public/               # Static files
```

## API Routes

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `GET /api/teams/[id]` - Get team
- `PUT /api/teams/[id]` - Update team
- `DELETE /api/teams/[id]` - Delete team

### Players
- `GET /api/players` - Get all players
- `POST /api/players` - Create player(s)
- `GET /api/players/[id]` - Get player
- `PUT /api/players/[id]` - Update player
- `DELETE /api/players/[id]` - Delete player
- `PUT /api/players/batch` - Bulk update

### Export
- `POST /api/export/team/[id]` - Export team to Excel
- `POST /api/export/all` - Export all teams to Excel

## Usage

1. **Create a Team**: Click "Add Team", fill details, upload logo
2. **Add Players**: Single or bulk add players to teams
3. **Set Batting Order**: Drag-and-drop to reorder players
4. **Export**: Download team data as Excel files

## Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Add environment variables
4. Deploy

## License

MIT License
