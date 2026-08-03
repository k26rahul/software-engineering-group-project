$sourceDir = ".\backend"
$tempBase = ".\temp_pkg"
$tempDir = "$tempBase\backend"
$zipFile = ".\backend.zip"

Write-Host "Packaging backend codebase..."

# Clean up any leftover files from previous runs
if (Test-Path $tempBase) { Remove-Item -Recurse -Force $tempBase }
if (Test-Path $zipFile) { Remove-Item -Force $zipFile }

# Create a temporary staging directory and copy the backend source code
New-Item -ItemType Directory -Path $tempBase | Out-Null
Copy-Item -Path $sourceDir -Destination $tempDir -Recurse

# Define the cache and environment directories that should NOT be in the final ZIP
$excludePatterns = @("__pycache__", ".pytest_cache", ".venv", ".mypy_cache", ".ruff_cache")

# Locate and delete those excluded directories from the staging folder
foreach ($pattern in $excludePatterns) {
    Get-ChildItem -Path $tempDir -Recurse -Directory -Filter $pattern | ForEach-Object {
        Write-Host "Excluding ignored folder: $($_.Name)"
        Remove-Item -Recurse -Force $_.FullName
    }
}

Write-Host "Compressing clean files into $zipFile..."
# Compress the staging folder into the final ZIP file
Compress-Archive -Path $tempDir -DestinationPath $zipFile

# Clean up the temporary staging directory
Remove-Item -Recurse -Force $tempBase

Write-Host "✅ Successfully packaged backend codebase into $zipFile!"
