# Deployment Helper Script
# Run this to verify everything is ready for deployment

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🚀 Outsider Deployment Checker" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "📦 Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green

# Check if required files exist
Write-Host ""
Write-Host "📁 Checking required files..." -ForegroundColor Yellow

$requiredFiles = @(
    "package.json",
    "netlify.toml",
    "render.yaml",
    "server/package.json",
    "server/index.js",
    "server/utils/sanitize.js",
    "DEPLOYMENT_GUIDE.md",
    "DEPLOYMENT_CHECKLIST.md"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file (MISSING!)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

# Check if node_modules exist
Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "   ✅ Client dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Client dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: npm install" -ForegroundColor Gray
}

if (Test-Path "server/node_modules") {
    Write-Host "   ✅ Server dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Server dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: cd server; npm install" -ForegroundColor Gray
}

# Check environment file
Write-Host ""
Write-Host "🔧 Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
    $envContent = Get-Content .env -Raw
    if ($envContent -match "VITE_SERVER_URL") {
        Write-Host "   ✅ VITE_SERVER_URL is configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  VITE_SERVER_URL not found in .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  .env file not found (optional for deployment)" -ForegroundColor Yellow
}

# Test build
Write-Host ""
Write-Host "🏗️  Testing production build..." -ForegroundColor Yellow
Write-Host "   This may take a moment..." -ForegroundColor Gray

try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Build successful!" -ForegroundColor Green
        if (Test-Path "dist") {
            $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
            Write-Host "   📊 Build size: $([math]::Round($distSize, 2)) MB" -ForegroundColor Green
        }
    } else {
        Write-Host "   ❌ Build failed!" -ForegroundColor Red
        Write-Host "   Check errors above" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Build failed with error: $_" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "📋 Deployment Readiness Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

if ($allFilesExist -and (Test-Path "node_modules") -and (Test-Path "server/node_modules") -and $LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ All checks passed! Ready to deploy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Commit and push to GitHub" -ForegroundColor White
    Write-Host "2. Follow DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
    Write-Host "3. Deploy server to Render" -ForegroundColor White
    Write-Host "4. Deploy frontend to Netlify" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️  Some issues found. Fix them before deploying." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Quick fixes:" -ForegroundColor Cyan
    Write-Host "- Run: npm install" -ForegroundColor White
    Write-Host "- Run: cd server; npm install" -ForegroundColor White
    Write-Host "- Fix build errors if any" -ForegroundColor White
    Write-Host ""
}

Write-Host "📖 For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "   - DEPLOYMENT_GUIDE.md (full guide)" -ForegroundColor White
Write-Host "   - DEPLOYMENT_CHECKLIST.md (step-by-step)" -ForegroundColor White
Write-Host "   - DEPLOYMENT_QUICK_REFERENCE.md (quick ref)" -ForegroundColor White
Write-Host ""
