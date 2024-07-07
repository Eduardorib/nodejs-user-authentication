# Node.js - User Authentication

A simple node.js user authentication, using: 
- postgres with sequelize ORM to persist data
- JWT for web tokens
- bcrypt for password hashing

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

Example:
```
PGUSER=postgres
PGPASSWORD=password
PGPORT=5432
PGDATABASE=UserAuth

secretKey = your_key
```
### Run
```
npm start
```
