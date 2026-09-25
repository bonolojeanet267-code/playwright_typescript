# SauceDemo Playwright Tests

[![Playwright Tests](https://github.com/bonolojeanet267-code/playwright_typescript/actions/workflows/playwright.yml/badge.svg)](https://github.com/bonolojeanet267-code/playwright_typescript/actions/workflows/playwright.yml)

This project runs SauceDemo browser and HTTP smoke tests with Playwright. GitHub Actions runs the tests on pushes and pull requests and uploads the Playwright HTML report as a workflow artifact.

## Local setup

```bash
npm install
npx playwright install chromium
npm test
```

The HTML report is written to `playwright-report` and JUnit output to `test-results/playwright-junit.xml`.

The test suite has one HTTP API project and runs the UI tests against Chromium. Use `npm run test:api` or `npm run test:chrome` to run either slice independently.

Optional credentials can be supplied with `SAUCE_USERNAME` and `SAUCE_PASSWORD`; defaults are SauceDemo's public `standard_user` and `secret_sauce` credentials.

## Xray Cloud integration

The GitHub Actions Chromium job imports `test-results/playwright-junit.xml` into Xray after the tests run. Configure these repository settings in GitHub:

- Secrets: `XRAY_CLIENT_ID` and `XRAY_CLIENT_SECRET`
- Repository variable: `XRAY_PROJECT_KEY`

The import is skipped when any of these values is missing. The Xray client secret is read only from GitHub Actions secrets and is not committed to the repository.
