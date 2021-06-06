# chat-app-backend
##### Version 3.0.0   

## Description

Backend server code for a simple chat application using HTTP long polling instead of Websockets. Written in Nodejs using ExpressJS.   
(Please note, this is the **server** repo, for frontend client, visit : [chat-app-frontend](https://github.com/shivamshekhar/chat-app-frontend))

## Prerequisites 

* Make sure [NodeJS v12.x](https://nodejs.org/) is installed along with [npm (node package manager)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

* Make sure [mysql v8.x](https://www.mysql.com/) is installed on your local.

## Getting Started

* Clone Repository and checkout
```bash
git clone https://github.com/shivamshekhar/chat-app-backend && cd chat-app-backend
```

* Install modules
```bash
npm i
```

* Run Db migrations
```bash
sudo mysql -u root -p < ./scripts/mysql/db.sql
```

* Run app
```bash
npm run start
```

* Verify that app is running successfully by visiting following url in browser
```bash
http://localhost:4000/test
```

If app is running successfully, you'll see following message
```javascript
{
    message : "App is running successfully"
}
```

## Scope of improvement

### Short Term

* ~~Made a frontend web client for this server.~~
* ~~Implement more functionality like adding a friend/contact, etc.~~
* Improve the auth and session token logic and make it more secure. 
* Improve long polling logic to make it work in cluster mode.

### Long Term

* Make an android client.
* ~~Reformat the code, and use Typescript instead of NodeJS.~~
* Introduce clustering to run multiple processes.

## Author

Shivam Shekhar  
shivamshekhar299@gmail.com
