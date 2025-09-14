# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e6]:
      - link "Text Adventure Platform" [ref=e7] [cursor=pointer]:
        - /url: /
      - navigation [ref=e8]:
        - link "Stories" [ref=e9] [cursor=pointer]:
          - /url: /stories
        - link "Login" [ref=e10] [cursor=pointer]:
          - /url: /login
          - button "Login" [ref=e11]
  - main [ref=e12]:
    - generic [ref=e13]:
      - heading "Register" [level=1] [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: Username
          - textbox [ref=e18]: storytest1757881774659
        - generic [ref=e19]:
          - generic [ref=e20]: Email
          - textbox [ref=e21]: storytest1757881774659@example.com
        - generic [ref=e22]:
          - generic [ref=e23]: Display Name (optional)
          - textbox [ref=e24]: Story Test User
        - generic [ref=e25]:
          - generic [ref=e26]: Password
          - textbox [ref=e27]: password123
        - paragraph [ref=e28]: An error occurred. Please try again.
        - button "Register" [ref=e29]
      - paragraph [ref=e30]:
        - text: Already have an account?
        - link "Login here" [ref=e31] [cursor=pointer]:
          - /url: /login
```