$ErrorActionPreference = 'Stop'

$resultsPath = $env:FAILED_TEST_RESULTS
if (-not (Test-Path $resultsPath)) {
  Write-Host "No JUnit results found at $resultsPath. Skipping Jira issue creation."
  exit 0
}

$jiraBaseUrl = $env:JIRA_BASE_URL
$jiraEmail = $env:JIRA_EMAIL
$jiraApiToken = $env:JIRA_API_TOKEN
$jiraProjectKey = $env:JIRA_PROJECT_KEY

if ([string]::IsNullOrWhiteSpace($jiraBaseUrl) -or [string]::IsNullOrWhiteSpace($jiraEmail) -or [string]::IsNullOrWhiteSpace($jiraApiToken) -or [string]::IsNullOrWhiteSpace($jiraProjectKey)) {
  throw 'Jira environment variables are unavailable. Set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, and JIRA_PROJECT_KEY.'
}

$xml = [xml](Get-Content -Raw -Path $resultsPath)
$failedCases = @($xml.testsuites.testsuite | ForEach-Object { $_.testcase } | Where-Object {
  [int]$_.failure.Count -gt 0 -or [int]$_.error.Count -gt 0
})

if ($failedCases.Count -eq 0) {
  Write-Host 'No failed test cases found. No Jira issues created.'
  exit 0
}

$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$jiraEmail:$jiraApiToken"))
$headers = @{
  Authorization = "Basic $credentials"
  'Content-Type' = 'application/json'
}

$created = 0

foreach ($testCase in $failedCases) {
  $name = [string]$testCase.name
  $className = [string]$testCase.classname
  $failure = if ($testCase.failure) { [string]$testCase.failure } else { [string]$testCase.error }
  $summary = "Automated test failure: $name"
  $description = @"
Playwright automated test failure

Test: $className - $name
Build: $($env:BUILD_BUILDNUMBER)

Failure:
$failure

See the published Playwright HTML report for trace, screenshot, and details.
"@

  $issueBody = @{
    fields = @{
      project = @{ key = $jiraProjectKey }
      summary = $summary
      description = @{
        type = 'doc'
        version = 1
        content = @(
          @{
            type = 'paragraph'
            content = @(
              @{ type = 'text'; text = $description }
            )
          }
        )
      }
      issuetype = @{ name = 'Bug' }
      labels = @('automated', 'playwright', 'saucedemo')
    }
  } | ConvertTo-Json -Depth 10

  $uri = "$jiraBaseUrl/rest/api/3/issue"
  Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body $issueBody | Out-Null
  $created++
}

Write-Host "Created $created Jira issue(s)."
