$ErrorActionPreference = 'Stop'

$resultsPath = $env:FAILED_TEST_RESULTS
if (-not (Test-Path $resultsPath)) {
  Write-Host "No JUnit results found at $resultsPath. Skipping work item creation."
  exit 0
}

$organizationUrl = $env:SYSTEM_COLLECTIONURI.TrimEnd('/')
$project = $env:SYSTEM_TEAMPROJECT
$token = $env:AZURE_DEVOPS_EXT_PAT
if ([string]::IsNullOrWhiteSpace($organizationUrl) -or [string]::IsNullOrWhiteSpace($project) -or [string]::IsNullOrWhiteSpace($token)) {
  throw 'Azure DevOps pipeline variables are unavailable. Enable Allow scripts to access the OAuth token.'
}

$xml = [xml](Get-Content -Raw -Path $resultsPath)
$failedCases = @($xml.testsuites.testsuite | ForEach-Object { $_.testcase } | Where-Object {
  [int]$_.failure.Count -gt 0 -or [int]$_.error.Count -gt 0
})
if ($failedCases.Count -eq 0) {
  Write-Host 'No failed test cases found. No bugs created.'
  exit 0
}

$headers = @{
  Authorization = "Bearer $token"
  'Content-Type' = 'application/json-patch+json'
}
$apiVersion = '7.1-preview.3'
$created = 0

foreach ($testCase in $failedCases) {
  $name = [string]$testCase.name
  $className = [string]$testCase.classname
  $failure = if ($testCase.failure) { [string]$testCase.failure } else { [string]$testCase.error }
  $title = "Automated test failure: $name"
  $description = @"
<h3>Playwright automated test failure</h3>
<p><b>Test:</b> $className - $name</p>
<p><b>Build:</b> <a href='$($env:BUILD_BUILDURI)'>$($env:BUILD_BUILDNUMBER)</a></p>
<p><b>Failure:</b></p>
<pre>$([System.Net.WebUtility]::HtmlEncode($failure))</pre>
<p>See the published playwright-report pipeline artifact for trace, screenshot, and HTML details.</p>
"@
  $document = @(
    @{ op = 'add'; path = '/fields/System.Title'; value = $title },
    @{ op = 'add'; path = '/fields/System.Description'; value = $description },
    @{ op = 'add'; path = '/fields/Microsoft.VSTS.TCM.ReproSteps'; value = "Run: npm test`nTest: $className - $name`nBuild: $($env:BUILD_BUILDNUMBER)" },
    @{ op = 'add'; path = '/fields/System.Tags'; value = 'automated; playwright; saucedemo' }
  ) | ConvertTo-Json -Depth 5

  $uri = "$organizationUrl/$project/_apis/wit/workitems/`$Bug?api-version=$apiVersion"
  Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body $document
  $created++
}

Write-Host "Created $created Azure DevOps bug work item(s)."
