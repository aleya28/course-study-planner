# Enable CORS for All API Gateway Endpoints
Write-Host "Starting CORS automation..." -ForegroundColor Cyan

# Get API ID
Write-Host "Getting API ID..." -ForegroundColor Yellow
$apiId = aws apigateway get-rest-apis --query "items[?name=='ServerlessRestApi'].id" --output text

if (!$apiId) {
    Write-Host "ERROR: Could not find API. Trying alternate name..." -ForegroundColor Red
    $apiId = aws apigateway get-rest-apis --query "items[0].id" --output text
}

Write-Host "API ID: $apiId" -ForegroundColor Green

# Get all resources
Write-Host "Getting all resources..." -ForegroundColor Yellow
$resourcesJson = aws apigateway get-resources --rest-api-id $apiId --output json
$resources = $resourcesJson | ConvertFrom-Json

Write-Host "Found $($resources.items.Count) resources" -ForegroundColor Green

# Enable CORS for each resource
$successCount = 0
$skipCount = 0

foreach ($resource in $resources.items) {
    Write-Host "Processing: $($resource.path)" -ForegroundColor Cyan
    
    $result = aws apigateway put-method --rest-api-id $apiId --resource-id $resource.id --http-method OPTIONS --authorization-type NONE --no-api-key-required 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        aws apigateway put-method-response --rest-api-id $apiId --resource-id $resource.id --http-method OPTIONS --status-code 200 --response-parameters "method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false" 2>&1 | Out-Null
        
        aws apigateway put-integration --rest-api-id $apiId --resource-id $resource.id --http-method OPTIONS --type MOCK --request-templates '{\"application/json\":\"{\\\"statusCode\\\": 200}\"}' 2>&1 | Out-Null
        
        aws apigateway put-integration-response --rest-api-id $apiId --resource-id $resource.id --http-method OPTIONS --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":\"'"'"'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'"'"'\",\"method.response.header.Access-Control-Allow-Methods\":\"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'\",\"method.response.header.Access-Control-Allow-Origin\":\"'"'"'*'"'"'\"}' 2>&1 | Out-Null
        
        Write-Host "  SUCCESS: $($resource.path)" -ForegroundColor Green
        $successCount++
    }
    else {
        Write-Host "  SKIPPED: $($resource.path)" -ForegroundColor Gray
        $skipCount++
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Successful: $successCount" -ForegroundColor Green
Write-Host "  Skipped: $skipCount" -ForegroundColor Gray
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Deploy API
Write-Host "Deploying API to prod stage..." -ForegroundColor Yellow
aws apigateway create-deployment --rest-api-id $apiId --stage-name prod --description "Enable CORS"

Write-Host ""
Write-Host "DONE! API deployed with CORS enabled!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Wait 30 seconds for deployment to complete" -ForegroundColor White
Write-Host "2. Go to browser (localhost:5173)" -ForegroundColor White
Write-Host "3. Hard refresh: Ctrl + Shift + R" -ForegroundColor White
Write-Host "4. Try create course again!" -ForegroundColor White
