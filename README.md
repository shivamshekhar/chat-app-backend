# chat-app-backend
##### Version 2.0.0   

## Description

Backend server code for a simple chat application. Written in Nodejs using ExpressJS.

## Prerequisites 

* Make sure Nodejs version >= 12 is installed (https://nodejs.org/) along with **npm** (node package manager)

* Make sure mysql (https://www.mysql.com/) version 8 is installed on your local.

## Getting Started

* Clone Repository and checkout
```bash
git clone https://github.com/shivamshekhar/chat-app-backend && cd chat-app-backend
```

* Install modules
```bash
npm install
```

* Run Db migrations
```bash
sudo mysql -u root -p < ./scripts/mysql/db.sql
```

* Run app
```bash
node app.js
```

* Verify that app is running successfully by visiting following url in browser
```bash
http://localhost:3000/test
```

If app is running successfully, you'll see following message
```javascript
{
    message : "App is running successfully"
}
```

## Scope of improvement

### Short Term

* Made a frontend web client for this server.
* Implement more functionality like adding a friend/contact, etc.
* Improve the auth and session token logic and make it more secure. 
* Improve long polling logic to make it work in cluster mode.

### Long Term

* Make an android client.
* Reformat the code, and use Typescript instead of NodeJS.
* Introduce clustering to run multiple processes.

## Author

Shivam Shekhar  
shivamshekhar299@gmail.com
