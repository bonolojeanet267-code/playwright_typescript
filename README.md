# SauceDemo Playwright UI and API Tests

[![Playwright Tests](https://github.com/bonolojeanet267-code/playwright_typescript/actions/workflows/playwright.yml/badge.svg)](https://github.com/bonolojeanet267-code/playwright_typescript/actions/workflows/playwright.yml)

This project runs SauceDemo browser and HTTP smoke tests and publishes the results to Jira through Xray Cloud so execution results and charts appear in the Jira dashboard.

## Xray setup

Add these GitHub repository secrets:

- `XRAY_CLIENT_ID`
- `XRAY_CLIENT_SECRET`
- `XRAY_PROJECT_KEY`
- `SAUCE_USERNAME`
- `SAUCE_PASSWORD`

The workflow runs the Playwright suite, writes JUnit XML, and imports the results to Xray using the Xray Cloud REST API so the Jira dashboard updates automatically.

## Local setup

```bash
npm install
npx playwright install chromium firefox webkit
npm test
```

The HTML report is written to `playwright-report` and JUnit output to `test-results/playwright-junit.xml`.

The test suite has one HTTP API project and runs the UI tests against Chromium, Firefox, and WebKit. Use `npm run test:api` or `npm run test:ui` to run either slice independently.

Optional credentials can be supplied with `SAUCE_USERNAME` and `SAUCE_PASSWORD`; defaults are SauceDemo's public `standard_user` and `secret_sauce` credentials.

## Jira setup

1. Create a pipeline from `azure-pipelines.yml`.
2. Add secret variables `SAUCE_USERNAME` and `SAUCE_PASSWORD` if you do not want to use the defaults.
3. Add secret variables `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, and `JIRA_PROJECT_KEY`.
4. Make sure the Jira user email has permission to create issues in the target project.

The pipeline always publishes JUnit results and the Playwright HTML report. When the test task fails, `scripts/create-jira-issues.ps1` reads the failed JUnit cases and creates one Jira issue per failed test using the Jira REST API.
