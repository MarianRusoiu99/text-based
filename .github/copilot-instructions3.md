## 🎯 Goals

1. Write automated end-to-end (E2E) tests using Playwright that verify behavior according to the spec / “Development Plan” folder.
2. Run those tests; observe failures.  
3. Based on test failure(s), update or fix the code so that the behavior under test passes, without breaking other existing tests.

---

## 📂 Context / Constraints

- The repository has a folder structure including a **Development Plan** folder (with detailed docs about intended implementation) and a **tests** folder (where Playwright tests live).
- **Do not modify any Prisma files / code**. The tests and fixes should leave the Prisma data layer / models untouched.
- Use default credentials when login/auth required:  
Email: test@example.com
Password: password123

markdown
Copy code

---

## 🧪 Testing Rules & Best Practices

When writing Playwright tests, follow these rules:

1. **Separation of tests**  
 - Tests for *registration* (or signup) must be in a separate test file / describe block from tests that assume an authenticated user.  
 - Do **not** perform registration in every test; only once in the dedicated registration test(s).

2. **Authentication setup**  
 - For any tests that require authentication, use a `beforeAll` hook (or global fixture) to log in with the default credentials.  
 - After login in `beforeAll`, reuse authenticated state for all tests in that test suite / file that require auth.

3. **Waiting for visibility**  
 - Before each test action that clicks or interacts with a component that must already be visible, wait a short time or use Playwright’s auto-waiting / explicit wait to ensure the component is visible (e.g. `await expect(locator).toBeVisible()` or `await page.waitForSelector(...)`).  
 - This prevents flakiness from trying to click on elements not yet rendered or visible.

4. **Assertions must be meaningful**  
 - After failure, the assertion must clearly state *what* went wrong (e.g. “Expected the login error message to appear when wrong password” or “Expected user profile page to show username ‘X’ after login”).  
 - Use Playwright’s built-in `expect()` assertions, and prefer web-first assertions (e.g. `toBeVisible()`, `toHaveText()`, `toHaveURL()` etc.).  

5. **Best practices**  
 - Use stable, resilient selectors: roles, test IDs, labels over brittle CSS classes or deep selectors.  
 - Keep tests isolated: avoid side effects between tests, clean state if needed.  
 - Name test cases clearly to reflect behavior being tested.  
 - Where possible, reuse setup logic via hooks (`beforeAll`, `beforeEach`) or fixtures.  
 - Tests should only test behavior visible to end user; avoid testing implementation details.  

---

## 🛠 Workflow for Agent

When asked to implement a new behavior or fix:

1. **Read** the relevant spec/doc in *Development Plan* to understand expected behavior.

2. **Write one or more Playwright tests** in the `tests/` folder that express the expected behavior. Put registration tests separately; for auth behavior tests, use `beforeAll` to login.

3. **Run tests** (in your environment). Collect failing tests, observe error messages / stack traces.

4. **Analyze failures**: Determine whether the code is missing behavior or has a bug.

5. **Modify code** (excluding Prisma layer) to satisfy test(s). Make minimal, focused changes.

6. **Re-run tests** to ensure:

 - The failing test(s) now pass.  
 - Existing tests still pass (i.e. no regressions).  

7. **Write assertion messages** (in tests) that clearly describe expected vs actual when failing.

---

## ⚙ Suggested Structure / File Naming

- Tests that need authentication: name like `*.auth.spec.ts` or `*.auth.test.ts`
- Registration tests: `registration.spec.ts` or `signup.spec.ts`
- Other feature tests: named after feature being tested (e.g. `profile.spec.ts`, `notes.spec.ts`, etc.)
- Use subfolders inside `tests/` if needed for grouping (e.g. `tests/auth/`, `tests/features/`)

---

## ✅ Example Template

Here is a small template for a Playwright test file that requires auth:

```ts
import { test, expect } from '@playwright/test';

test.describe('Feature X (requires auth)', () => {
test.beforeAll(async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: /login/i }).click();
  // wait till some user-specific element is visible
  await expect(page.getByText('Welcome, test')).toBeVisible();
});

test('should show feature X content when logged in', async ({ page }) => {
  await page.goto('/feature-x');
  // wait for component to be visible
  await expect(page.getByRole('heading', { name: /Feature X/i })).toBeVisible();
  // other assertions...
});

// more tests that assume auth...
});
📝 When to Ask for Clarification
If the agent is unsure about:

The exact URL / route names / component labels to use (e.g. login page route, feature page route), refer to Development Plan docs.

What text is expected (exact strings), unless spec states them.


