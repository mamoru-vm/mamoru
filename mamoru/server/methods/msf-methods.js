// Meteor methods that make calls to metasploit either directly, or through a colletion hook
// hooks are defined alongside collections, collections/server/hooks/*.js

Meteor.methods({

// to be very restrictive. allows full access to msf api, dangerous...
msfCommand: function(cmds){
    if(Meteor.userId()) {
      var resp =  msfAPI.clientExec(cmds);
      if(resp.error){
        throw new Meteor.Error('mamoru-error', "Command does not exist", resp.error_message)
      } else {
        return resp
      }
    } else {
      throw new Meteor.Error('mamoru-error', "You are not allowed")
    }

  },

jobInfo: function(jobId){
  return Mamoru.Utils.jobInfo(jobId);
},

jobList: function(){
  return Mamoru.Utils.jobList();
},

runModule: function(moduleId, options){
  if(Meteor.userId()){
    var thisMod = Mamoru.Collections.Modules.findOne(moduleId);
    var runRes = Mamoru.Utils.runModule(moduleId, options); // add some error checking.
    if(thisMod.cat == 'exploit'){
      var thisUser = Meteor.users.findOne(Meteor.userId()).username;
      var waitForSessionWorker = new Job(Mamoru.Collections.ApiJobs, 'exploitCheck', {userID:thisUser, exploitUUID: runRes.uuid} ).save();
      runRes["mamoru_job_id"] = waitForSessionWorker;
      return runRes;
    } 
      return runRes
  } else {
    throw new Meteor.Error('mamoru-error', "You are not allowed")
  }

  },

 readSession: function(sessionId, sessionType){
 if(Meteor.userId()) {
  if(sessionType == 'shell'){
      return Mamoru.Utils.readShellSession(sessionId);
    } else if(sessionType == 'meterpreter'){
      return Mamoru.Utils.readMetepreterSession(sessionId);
    }
  } else {
    throw new Meteor.Error("not-allowed", "You are not logged in");
  }
 },
  
  upgradeShell: function(sessionId, port){
    return Mamoru.Utils.upgradeSession(sessionId, "192.168.0.137", port);
  },

checkForSessions: function(){
    this.unblock();
    Mamoru.Sync.Sessions();
    return "OK!";
  },

  writeSession: function(cmd,opts){
  if(Meteor.userId()) {
    var sessionId = opts.sessionId;
    var sessionType = opts.type;
    if(sessionType == 'shell'){
      return Mamoru.Utils.writeShellSession(sessionId, cmd);
    } else if(sessionType == 'meterpreter'){
      return Mamoru.Utils.writeMetepreterSession(sessionId, cmd);
    }
  } else {
    throw new Meteor.Error("not-allowed", "You are not logged in");
  }
 },

  createConsole: function(){
  if(Meteor.userId()) {
    if (!process.env.IS_MIRROR) {
      return Mamoru.Utils.createConsole()
   } else {
    return {id:1, prompt:'test'}
   }
  } else {
  throw new Meteor.Error("not-allowed", "You are not logged in");
  }
  },

  destroyConsole: function(consoleId){
     if(Meteor.userId()) {
        if (!process.env.IS_MIRROR) {
           return Mamoru.Utils.destroyConsole(consoleId);
       } else {
        // fake console destroy stub
        return {result:'success'}
       }
      } else {
        throw new Meteor.Error("not-allowed", "You are not logged in");
      }
  },

  addProject: function(projectName){
    if(Meteor.userId() && Roles.userIsInRole(Meteor.userId(),'admin')) {
      return Mamoru.Collections.Projects.insert({name:projectName});
    } else {
      throw new Meteor.Error("not-allowed", "Not for you!");
    }
  },

  removeProject: function(projectName){
    if(Meteor.userId() && Roles.userIsInRole(Meteor.userId(),'admin')) {
      return Mamoru.Collections.Projects.remove({name:projectName});
    } else {
      throw new Meteor.Error("not-allowed", "Not for you!");
    }
  },

 addHost:function(hostInfo){
     if(Meteor.userId()){
      Mamoru.Collections.Hosts.insert(hostInfo);
     }
  },

  insertScan: function(fileId, projectName){
    let insertResults = msfAPI.insertScan(fileId);
    Mamoru.Utils.syncAllProjectHosts(projectName);
    return insertResults
  },

  setProject: function(projectSlug){
    var projectName = Mamoru.Collections.Projects.findOne({slug:projectSlug}).name
    return Mamoru.Utils.setProject(projectName);
  },

  enumerateHost:function(address, aggression, ports, hostId){
   if(Meteor.userId()){
    if(ports){
       var cmd = `db_nmap -A -T${aggression} -p ${ports} ${address}\n`
    } else {
       var cmd = `db_nmap -A -T${aggression} ${address}\n`
    }

    let newJob = new Job(Mamoru.Collections.Jobs, 'consoleAction',{command:cmd, userId:Meteor.userId()}).save();
    Mamoru.Queues.consoleWrite.trigger()
    Mamoru.Collections.Hosts.direct.update(hostId, {$set:{enumerating:true}});
    return newJob
   }
  },

  consoleJob: function(command){
    var newJob = new Job(Mamoru.Collections.Jobs, 'consoleAction',{command:command}).save();
    Mamoru.Queues.consoleWrite.trigger()
    return newJob
  },

  syncAllHosts:function(projectName){
    Mamoru.Utils.syncAllProjectHosts(projectName);
  },

  syncHost:function(projectSlug, hostAddress){
    Mamoru.Utils.syncProjectHost(projectSlug, hostAddress);
  },

  delHost: function(hostId){
    return Mamoru.Collections.Hosts.remove(hostId);
  },

  insertScanFileText: function(fileContentsb64, projectName){
    if(Meteor.userId()){
      let result =  msfAPI.insertScanText(fileContentsb64);
      if(result.error === true){
        throw new Meteor.Error("insert-scan-failed", result.error_string);
      } else {
        Mamoru.Utils.syncAllProjectHosts(projectName);
        return result
      } 
    } else {
      throw new Meteor.Error("not-allowed", "Not for you!");
    }
  },

  // experimental....
  apiJob: function(command){
    var newJob = new Job(Mamoru.Collections.ApiJobs, 'apiCall', {command:command}).save();
    Mamoru.Queues.msfAPIcalls.trigger()
    return newJob
  }

})