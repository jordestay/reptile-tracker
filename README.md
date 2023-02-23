# Reptile Tracker
This is a server that supports an app for managing reptiles via an API. Authentication is required for using the relational database.

## Devlog
|Date |Time  |Ppl |Notes |
--- | --- | --- | ---|
|2/22/23 |1.5h |NT |minor tweaks and postman testing |
|2/22/23 |3h |AA, CF, NT |controller setup and some testing |
|2/21/23 |2h |NT |user authentication and reptile manipulation functionality | 
|2/20/23 |1.5h |AA, CF, JT, NT |postman setup |  
|2/17/23 |1h |AA, CF, NT |prisma setup |  
|2/15/23 |1h |JT |initiated repo |  

## Assignment Instructions
1.  Create a project using Express and implement all of the endpoints to perform the required operations
2.  Use prisma for managing your database. ([Prisma Setup](https://usu.instructure.com/courses/729048/pages/prisma-and-databases?module_item_id=5522700) | [Docs](https://www.prisma.io/docs/getting-started/quickstart))
3.  Write the endpoints
    1.  You should follow good practices as far as code reuse goes (hint: middleware can be your friend for things like authentication)
    2.  You should follow the proper naming convention for endpoints, for example GET /reptiles should respond with all of my reptiles, and POST /schedules/:reptileId should create a schedule for a reptile.
4.  Test all of your endpoints using postman.  
    1.  Make sure to save your tests in postman to a collection! You will be turning in that collection!
5.  Write a README.md telling me how to setup and run your server
    1.  Please follow this convention for setup (that way I don't have to remember which commands to run for which projects)
        1.  \`yarn\` or \`npm install\` to install the dependencies
        2.  \`yarn migrate\` or \`npm run migrate\` to setup the database
        3.  \`yarn dev\` or \`npm run dev\` to start the dev server
        4.  \`yarn build\` or \`npm run build\` to build for production
    2.  You should specify any additional setup steps in readme.
6.  Export your postman collection.
7.  Delete your node\_modules directory
8.  Submit your postman collection export and your zipped up source code to Canvas

## Security 
- authenticate any 🔐 story
- authorization: no access to any data that does not directly belong to user/user's reptiles

## Database relationships

A **User** has many **Reptiles, and Schedules.**

A **Reptile** has many **Feedings, HusbandryRecords, and Schedules** 

## Technical Requirements: Stories  
- User
	- create
	- sign in
- Reptile
	- create 🔐
	- delete 🔐
	- update 🔐
	- list all 🔐
	- Feeding
		- create 🔐
		- list all 🔐
	- Husbandry record
		- create 🔐
		- list all 🔐
	- schedule pt.1
		- create 🔐
		- list all 🔐
- Schedule pt.2
	- list all schedules for a user 🔐

----
## Running Local Server
This project serves as a starting point for full-stack applications.

### Database
Create the database by running
```bash
yarn db:migrate
```
You will need the re-run this command anytime you make changes to the schema file.

### Running thhe server
Start the server by running:

With yarn
```bash
yarn dev
```

With npm
```bash
npm run dev
```

## Production
Build the project by running

With yarn
```bash
yarn build
```

With npm
```bash
npm run build
```
Footer
© 2023 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
