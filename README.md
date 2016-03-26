# Mamoru 
A real-time web platform for managing and testing software vulnerabilities.

## Features
- [X] Provides real time web interface to the popular Metasploit Framework (MSF)
- [X] Intuitive PenTest Methodology for simple execution of basic testing operations
- [X] Browse Metasploit modules  
- [ ] Exploit Systems with Metasploit Exploit Modules
- [ ] Interact with systems over metepreter shell
- [ ] Plugin interface for adding functionality
- [ ] ...

## Best Suited For
- System administrators and students getting started in security
  - Collaborative penetration testing
  - Vulnerability Managment
  - ....

## Architecture
### Meteor Package Based architecture
- Functionality broken up into project scoped Meteor packages (/packages)

### Server side asyncrounous actions are wrapped in Fibres or run as a Job-Collection job
- Fibres are used to wrap short dependable callbacks (e.g. normal calls to MSF API)
- jobs are used for longer running or more error prone operations
  - e.g need to be logged or rerun (worker process) \ 
    or take a long time and would cause serious blocking on main node thread
    (db_nmap, other long running msf calls)

### Utilizes seperate node worker processes running in independant node:5.5 docker containers
- Main worker manages metasploit depenencies (MSFRPCD, Postgres)
  - Both running in seperate, linked containers
- Connects to Mamoru server over DDP, to authenticate and recieve jobs to work on
- Worker is responsible for launching dependency containers, and sending relevant connection details 
  back to Mamoru server to be utilized
  
## Plugins 
- Plugin Interface built ontop of Meteor package system (WORK IN PROGRESS) 
  - Functionalilty can be added via Meteor packages that export a single
    object meeting the following specification:

```javacript
// TBD
{}
```

## settings.json definitions
```javascript
{ 
  "adminName": "admin",             // mamoru administrator config
  "adminEmail": "admin@msfweb.com", //            ""
  "adminPass": "adminPass",         //            ""

  "postgresDB": "mamoru",           // name of postgress DB for this mamoru instance
  "pgRootPass": "postgresRoot!",    // root password for postgres DB

  "MsfRPCDUser":"mamoru",           // postgres and MSFRPCD user config for this mamoru instance
  "MsfRPCDPass":"msfRPCDPass!",     //            ""
              
  "validateEmails": false,          // TO IMPLEMENT - SMTP mail configuration to validate user signups or phishing stuff

  "workerPass": "aStrongPass",      // password used for job-worker that connects over DDP
  "consolePoolSize":3               // # of MSF consoles to spawn for handling console jobs (db_nmap for example)
}
```

# Developer References

## Export / Import Mongo Initial Modules
```bash
mongoexport -h localhost:3001 --db meteor --collection modules -q '{cat:"exploit"}' --jsonArray -o exploits.json
mongoexport -h localhost:3001 --db meteor --collection modules -q '{ cat: { $not: /^ex.*/ } }' --jsonArray -o other.json

mongoimport -h localhost:3001 --db meteor --collection modules --jsonArray --type json --file exploits.json
mongoimport -h localhost:3001 --db meteor --collection modules --jsonArray --type json --file other.json
```

## sequelize model creation from mamoru-plugin-main package using sequelize-auto
```bash
sequelize-auto -o "./models" -d mamoru -h 172.17.0.1 -u mamoru -p 5432 -x msfRPCDPass! -e postgres

```

### Special thanks to these open source projects used to make this possible
- Rapid7 - Metasploit Framework
- Meteor
 - Job Collection
- Semantic UI
- Docker
