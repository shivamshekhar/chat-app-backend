# chat-app-backend

## Description

Backend server code for a simple chat application. Written in Nodejs using ExpressJS.

## Prerequisites 

Make sure Nodejs version >= 12 is installed (https://nodejs.org/) along with **npm** (node package manager)

## Getting Started

* Clone Repository and checkout
```bash
git clone https://github.com/shivamshekhar/chat-app-backend && cd chat-app-backend
```

* Install modules
```bash
npm install
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

* Implement a SQL database to persist data, instead of keeping them in in-memory maps.
* Made a frontend web client for this server.
* Implement more functionality like adding a friend/contact, etc.
* Improve the auth and session token logic and make it more secure.

### Long Term

* Deploy this code on an AWS instance.
* Make an android client.
* Reformat the code, and use Typescript instead of NodeJS.

## Author

Shivam Shekhar  
shivamshekhar299@gmail.com
