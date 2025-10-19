@echo off
echo Building for production...
call npm run build

echo.
echo Testing production build locally...
call npm run preview

echo.
echo Production build test complete!
echo.
echo Next steps:
echo 1. Test the preview at http://localhost:4173
echo 2. If everything works, deploy to Netlify!
echo.
pause
