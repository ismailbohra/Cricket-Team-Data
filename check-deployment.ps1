# Pre-Deployment Check Script

Write-Host "🔍 Checking if your project is ready for deployment..." -ForegroundColor Cyan
Write-Host ""

$readyToDeploy = $true

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Dependencies not installed. Run: npm install" -ForegroundColor Red
    $readyToDeploy = $false
}

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local file not found (OK for deployment)" -ForegroundColor Yellow
}

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "✅ package.json found" -ForegroundColor Green
} else {
    Write-Host "❌ package.json not found" -ForegroundColor Red
    $readyToDeploy = $false
}

# Check if next.config exists
if (Test-Path "next.config.ts") {
    Write-Host "✅ next.config.ts found" -ForegroundColor Green
} else {
    Write-Host "⚠️  next.config.ts not found" -ForegroundColor Yellow
}

# Check critical directories
$dirs = @("app", "components", "models", "lib")
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "✅ $dir directory exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $dir directory not found" -ForegroundColor Red
        $readyToDeploy = $false
    }
}

# Check if git is initialized
if (Test-Path ".git") {
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git not initialized. Run: git init" -ForegroundColor Yellow
}

# Check gitignore
if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    if ($gitignoreContent -match "node_modules" -and $gitignoreContent -match ".env.local") {
        Write-Host "✅ .gitignore properly configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .gitignore may need updating" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  .gitignore not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($readyToDeploy) {
    Write-Host "✨ Your project is ready for deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Push to GitHub: git add . && git commit -m 'Ready for deployment' && git push" -ForegroundColor White
    Write-Host "2. Go to vercel.com and import your repository" -ForegroundColor White
    Write-Host "3. See DEPLOYMENT_CHECKLIST.md for detailed steps" -ForegroundColor White
} else {
    Write-Host "❌ Please fix the issues above before deploying" -ForegroundColor Red
}

Write-Host ""
