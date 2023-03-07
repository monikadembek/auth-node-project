# auth-node-project
Authentication and authorization with JWT in Node.js/express.js
Project also implements roles and permissions.

### Building the project
run `npm install` to install necessary dependencies

### Running the project
run in console: `npm run start-auth-server` - starts auth server on port 4000 which handles the authorization and authentication

run in console: `npm run start` - starts second server on port 3000 which handles posts routes to check the use of authorization with jwt tokens

### Testing how the application works
To test out the application use requests prepared in files: **auth-requests.http**, **requests.http** in REST Client plugin or Postman.
