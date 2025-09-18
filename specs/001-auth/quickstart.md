# Quickstart: Authentication Flow

1. Register a user
```
POST /v1/auth/register
{"username":"alice","email":"alice@example.com","password":"Str0ng!Pass","displayName":"Alice"}
```
→ Expect 201, success true, data.user.id

2. Verify email
```
POST /v1/auth/verify-email
{"token":"<from email provider/logs>"}
```
→ Expect 200, user.isVerified = true

3. Login
```
POST /v1/auth/login
{"usernameOrEmail":"alice","password":"Str0ng!Pass"}
```
→ Expect 200, data.accessToken, data.refreshToken

4. Get profile
```
GET /v1/users/profile
Authorization: Bearer <accessToken>
```
→ Expect 200, data.username == "alice"

5. Refresh token
```
POST /v1/auth/refresh
{"refreshToken":"<refreshToken>"}
```
→ Expect 200, new accessToken and refreshToken

6. Logout
```
POST /v1/auth/logout
Authorization: Bearer <accessToken>
```
→ Expect 200, subsequent refresh with old token fails
