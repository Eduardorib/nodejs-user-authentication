# Node.js - User Authentication
A simple node.js user authentication, using postgres to persist data and JWT for web tokens.

## To do:
- Password Hashing (bcrypt) ✅
- Route Protection (JWT) ✅
- Role-Based Access Control
- Reset Password
- OAuth

## Project setup
```
npm install
```

Then, add an `/.env` file with correct DB credentials and secret key of your choice.

Example

PGUSER=postgres
PGPASSWORD=password
PGPORT=5432
PGDATABASE=UserAuth

secretKey = your_key

### Run
```
npm start
```
