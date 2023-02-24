# Reptile Tracker
This is a server that supports an app for managing reptiles via an API. Authentication is required for using the relational database.

## Database relationships

A **User** has many **Reptiles, and Schedules.**

A **Reptile** has many **Feedings, HusbandryRecords, and Schedules** 

### Database
Create the database by running
```bash
yarn db:migrate
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