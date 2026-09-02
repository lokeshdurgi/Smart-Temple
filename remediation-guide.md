# Security Remediation & Best Practices Guide

## 1. Defensive HTTP Security Headers
To ensure maximum protection against cross-site scripting (XSS) and clickjacking, maintain `helmet` middleware initialization in Express:

```javascript
const helmet = require('helmet');
app.use(helmet());
```

## 2. NoSQL Query Parameter Sanitization
Ensure user-supplied query input parameters are always sanitized or cast to string types prior to Mongoose query execution:

```javascript
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
```

## 3. JWT Expiration & Verification
Always specify explicit expiration parameters and secret keys when signing JWT tokens:

```javascript
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
  expiresIn: '24h',
  algorithm: 'HS256'
});
```

## 4. Load & Scaling Recommendations
- Configure horizontal pod autoscaling or reverse proxy balancing (e.g. Nginx) when request load exceeds 1,000 VUs.
- Implement Redis caching for database-heavy endpoints like `/api/menu` and `/api/dashboard`.
