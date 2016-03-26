// exported object
Msf = {
  name: "mamoru-main",
  PG: null, // store initalized PG client object here
  API: null,   // store initalized msfAPI client object here
  init:{ 
    metasploit: function(containerDetails){ 
      Msf.API = msfAPI.newClient({        
                    user: containerDetails.Env.MSFRPC_USER,
                    password: containerDetails.Env.MSFRPC_PASS,
                    // host is delivered by worker after container has started...
                    host: containerDetails.IP,
                    persist:true
        });
       console.log("MSFAPI CLIENT SET!");  
       
       Mamoru.Sync.allProjects()
       
       Mamoru.Collections.Projects.find().forEach(function (project) {
        Mamoru.Sync.AllProjectHosts(project.name)
       }); 

      Mamoru.Sync.ConsolePool()

      
 
  },
postgres: function(containerDetails){
    Msf.PG = {}
    const pgUser = Meteor.settings.MsfRPCDUser;
    const pgPass = Meteor.settings.MsfRPCDPass;
    // pgIP is delivered by worker after container has started...
    const pgIP = containerDetails.IP;
    const pgDB = Meteor.settings.postgresDB;
    var Sequelize = Npm.require('sequelize');
    console.log(`postgres://${pgUser}:${pgPass}@${pgIP}:5432/${pgDB}`)
    let connectString = `postgres://${pgUser}:${pgPass}@${pgIP}:5432/${pgDB}`
    let sequelize = new Sequelize(connectString);
    // models come from postgres/models
    Msf.PG.Host = hostModel(sequelize,Sequelize);
    Msf.PG.Service = serviceModel(sequelize,Sequelize);
    Msf.PG.Vuln = vulnModel(sequelize,Sequelize);
    Msf.PG.VulnAttempt = vulnAttemptsModel(sequelize,Sequelize);
    Msf.PG.Note = noteModel(sequelize,Sequelize);
    Msf.PG.Client = clientModel(sequelize,Sequelize);
    Msf.PG.Workspace = workspaceModel(sequelize,Sequelize);
    Msf.PG.Session = sessionModel(sequelize,Sequelize);
    Msf.PG.Listener = listenerModel(sequelize,Sequelize);
    Msf.PG.Exploit = exploitAttemptsModel(sequelize,Sequelize);
    return Msf.PG
    console.log("PG INFO SET!");
  }
},
dockerData: [
  {  
    name:"postgres",
    plugin: "mamoru-main",
    depends: null,
    config: {
      name: "mamoru-pg",
      Labels: {"mamoru": "postgres"},
      Image:'postgres:9.4',
      Env: [
            "POSTGRES_PASSWORD=" + Meteor.settings.pgRootPass,
            "PGDATA=/pgdata"
           ],
      HostConfig: {
                    Binds: [process.env.HOME + '/.mamoru/pgdata:/pgdata']
                  }
    }
  },
  {
    name: "metasploit",
    plugin: "mamoru-main",
    depends: "postgres", 
    config:{
      name: 'mamoru-msf',
      Labels: {"mamoru": "metasploit"},
      Image: 'mamoru/metasploit-rpcd',
      Env:["MSFRPC_USER=" + Meteor.settings.MsfRPCDUser,
           "MSFRPC_PASS=" + Meteor.settings.MsfRPCDPass,
           "MSF_DB=" + Meteor.settings.postgresDB
          ],
      ExposedPorts: {
                    "4444/tcp":{},
                    "4445/tcp":{},
                    "4446/tcp":{},
                    "4447/tcp":{},
                    },
      HostConfig: {
                    Links: ["mamoru-pg:pg"],
                    PortBindings: {
                                  "4444/tcp":[{"HostIp":"0.0.0.0" ,"HostPort": "4444" }],
                                  "4445/tcp":[{"HostIp":"0.0.0.0" ,"HostPort": "4445" }],
                                  "4446/tcp":[{"HostIp":"0.0.0.0" ,"HostPort": "4446" }],
                                  "4447/tcp":[{"HostIp":"0.0.0.0" ,"HostPort": "4447" }]
                                  }
                  }
    }
  }
]
}