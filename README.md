# Reptile Tracker
This is a server that supports an app for managing reptiles via an API. Authentication is required for using the relational database.

## Devlog
|Date |Time  |Ppl |Notes |
--- | --- | --- | ---|
|3/31/23 |7h |NT |cleaned up the reptile page and ensured all aspects of it are functional|
|3/29/23 |4h |NT |worked on getting reptile page functional and started on appearance|
|3/29/23 |1.5h |AA, CF, JT, NT |coordinated page assignments and layouts|
|3/29/23 |3h |NT |figured out server communication (finally!)|
|3/28/23 |1h |NT |more server communication troubleshooting|
|3/27/23 |2h |NT |continued to troubleshoot server communication|
|3/24/23 |4h |NT |tried to work out how to get servers to communicate|
|3/23/23 |1h |AA, CF, JT, NT |got skeleton of project built out|
|3/11/23 |1h |JT |created base SPA layout |
|2/23/23 |1.5h |NT |fixed bugs in schedules controller and tested endpoints |
|2/22/23 |1.5h |JT |added scheduling controllers for Reptiles and Users |
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

### Install dependencies
Install any necessary dependencies by running

With yarn
```bash
yarn
```

with npm
```bash
npm install
```

### Database
Create the database by running

With yarn
```bash
yarn db:migrate
```

With npm
```bash
npm run migrate
```

You will need the re-run this command anytime you make changes to the schema file.

### Running the server
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

## Devlog
|Date |Time  |Ppl |Notes |
--- | --- | --- | ---|
|2/23/23 |1.5h |NT |fixed bugs in schedules controller and tested endpoints |
|2/22/23 |1.5h |NT |minor tweaks and postman testing |
|2/22/23 |3h |AA, CF, NT |controller setup and some testing |
|2/21/23 |2h |NT |user authentication and reptile manipulation functionality | 
|2/20/23 |1.5h |AA, CF, JT, NT |postman setup |  
|2/17/23 |1h |AA, CF, NT |prisma setup |  
|2/15/23 |1h |JT |initiated repo |  