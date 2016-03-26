function moduleIsInMongo(modulePath, parent){
    return (Mamoru.Collections.Modules.findOne({path: parent + "/" + modulePath})) ? true : false 
}

Mamoru.Utils.getPlugins = function(){
    const isPlugin = /^mamoru:.*-plugin$/
    var pluginArray = [];
    for(let k in Package ){
        if(isPlugin.test(k)){
            pluginArray.push(Package[k]);
        }
    };
    //console.log(pluginArray);
    return pluginArray
}

//wrapper around Meteor Accounts.createUser to make setting roles a bit easier
Mamoru.Utils.createUser = function(email, password, opts){

    const userName = opts.username || email.split("@")[0]
    const role = opts.role || "user"

    var userId = Accounts.createUser({
        email: email,
        password: password,
        profile: {roles:[role]}
    });
    Accounts.setUsername(userId, userName);
    // add user to roles
    Roles.addUsersToRoles(userId, [role]);
    console.log("Created user: " + userName);

}

Mamoru.Utils.createAdminUser = function (){
        if(!Accounts.findUserByEmail(Meteor.settings.adminEmail)){
            Mamoru.Utils.createUser(Meteor.settings.adminEmail,
                        Meteor.settings.adminPass,
                        {role:"admin"}
                       );
        } else {
            console.log("admin user exists")
        }
       
}


Mamoru.Utils.listConsoles = function(){
    try{
    return msfAPI.clientExec(['console.list']);
    }
    catch(err){
        console.log(err)
        return [];
    }
}

Mamoru.Utils.createConsole = function(){
      var newConsole =  msfAPI.clientExec(['console.create']);
      if(newConsole){
        return newConsole
      } else {
        throw new Meteor.Error("Whoops cannot create console...")
      }
}   

Mamoru.Utils.destroyConsole = function(consoleId){
   return msfAPI.clientExec(['console.destroy', Number(consoleId)])
}

Mamoru.Utils.destroyConsoles = function(){
   let result = msfAPI.clientExec(['console.list']);
   for(let i=0;i<result.length;i++){
        Mamoru.Utils.destroyConsole(result[i].id)
   }
}

Mamoru.Utils.consoleRead = function(consoleId){
   return msfAPI.clientExec(['console.read', consoleId]);

}

Mamoru.Utils.consoleWrite = function(consoleId, stringCommand){
    return msfAPI.clientExec(['console.write', consoleId, stringCommand]);
}

Mamoru.Utils.consoleTabs = function(consoleId, partialCommand){
    return msfAPI.clientExec(['console.write', consoleId, partialCommand]);
}

Mamoru.Utils.runModule = function(modId, modOptions){
    var thisMod = Mamoru.Collections.Modules.findOne(modId);
    console.log(modOptions);
    var res = msfAPI.clientExec(['module.execute', thisMod.cat, thisMod.path, modOptions]);
    console.log(res)
    return res
}

Mamoru.Utils.jobList = function(){
    var jobs = msfAPI.clientExec(['job.list']); 
    if(Object.keys(jobs).length == 0){
        return false
    } else {
        return jobs
    }
}

Mamoru.Utils.jobInfo = function(jobId){
    return msfAPI.clientExec(['job.info', jobId]);
}

Mamoru.Utils.jobStop = function(jobId){
    return msfAPI.clientExec(['job.stop', jobId]);
}

Mamoru.Utils.killSession = function(Id){
    var thisSession = Mamoru.Collections.Sessions.findOne(Id).sessionId
    var res = msfAPI.clientExec(['session.stop', thisSession]);
    if('result' in res){
        Mamoru.Collections.Sessions.update({_id: Id},{$set:{established: false, stoppedAt: moment.now()}});
        return res.result;
    } else {
        return res.error_message;
    }
}

Mamoru.Utils.listSessions = function(){
    return msfAPI.clientExec(['session.list']);
}

Mamoru.Utils.compatiblePost = function(sessionId){
    return msfAPI.clientExec(['session.compatible_modules', sessionId]);
}

Mamoru.Utils.upgradeSession = function(sessionId, lhost, lport){
    return msfAPI.clientExec(['session.shell_upgrade', sessionId, lhost, lport]);
}

Mamoru.Utils.readShellSession = function(sessionId){
    return msfAPI.clientExec(['session.shell_read', sessionId]);
}

Mamoru.Utils.writeShellSession = function(sessionId, cmd){
    return msfAPI.clientExec(['session.shell_write', sessionId, cmd + "\n"]);
}

Mamoru.Utils.readMetepreterSession = function(sessionId){
    return msfAPI.clientExec(['session.meterpreter_read', sessionId]);
}

Mamoru.Utils.writeMetepreterSession = function(sessionId, cmd){
    return msfAPI.clientExec(['session.meterpreter_write', sessionId, cmd]);
}

Mamoru.Utils.readPromptSession = function(sessionId){
    return msfAPI.clientExec(['session.ring_last', sessionId]);
}

Mamoru.Utils.writePromptSession = function(sessionId, cmd){
    return msfAPI.clientExec(['session.ring_put', sessionId, cmd]);
}


Mamoru.Utils.detatchMetepreterSession = function(sessionId){
    return msfAPI.clientExec(['session.meterpreter_session_detach', sessionId, cmd]);
}



// not using, syncing as a part of host records....
/*
Mamoru.Utils.syncProjectServices = function(projectId){
    let thisWorkspace = Mamoru.Collections.Projects.findOne(projectId);
    let thisProjectHosts = Mamoru.Collections.Hosts.find({projectId:thisWorkspace._id},{fields:{address:1}}).fetch()
    Mamoru.Utils.setProject(thisWorkspace.name);
    for(let i=0;i<thisProjectHosts.length;i++){
        let services = msfAPI.clientExec(['db.services', {addresses:thisProjectHosts[i].address}]);
        for(let ii=0;ii<services.length;ii++){
            delete services[i].host;
            Mamoru.Collections.Hosts.update({address:thisProjectHosts[i].address},{$push:{services:services[i]}});
        }
    }
}
*/


/*
hostInfo
{
    host: String, // required 
    state: String, // one of ['alive', 'dead', 'down']
    os_name: String, // 'Windows', 'Linux', 'Mac OS X'
    os_flavor: String, // ie 'Enterprise', 'Pro'
    os_sp: String, // ie - 'SP2'
    os_lang: String, // "en-US", "English"
    arch: String, // https://github.com/rapid7/metasploit-framework/blob/master/lib/rex/constants.rb
    mac: String, // MAC Address
    info: String, // undocumented - info can also be attached
    purpose: String, // undocumented - host purpose, 'server', 'workstation' etc
    scope: String, // Interface identifier for link-local IPv6.?
    virtual_host: String // The name of the VM host software, eg "VMWare", "QEMU", "Xen", etc.
}
*/
Mamoru.Utils.addHost = function(hostInfo){
    if(!hostInfo.host){
      console.log('must enter host IP');
    } else {
        let addResult = msfAPI.clientExec(['db.report_host', hostInfo]);
        if(addResult.result === 'success'){
            let MSFhostInfo = msfAPI.clientExec(['db.get_host', {address:hostInfo.host}]);
            return MSFhostInfo[0]
        } else {
            console.log("msf host add failed");
            return false
        }
    }
}

// hostAddresses array of addresses ['192.168.0.1']
Mamoru.Utils.delHost = function(projectName, hostAddress){
    let delRes =  msfAPI.clientExec(['db.del_host', {workspace:projectName, host:hostAddress}]);
    console.log(delRes);
    return delRes
}

// hostAddresses array of addresses ['192.168.0.1']
Mamoru.Utils.delService = function(hostAddress, serviceInfo){
    let delRes =  msfAPI.clientExec(['db.del_service', {host:hostAddress, port:serviceInfo.port, proto:serviceInfo.proto}]);
    return delRes
}

// hostAddresses array of addresses ['192.168.0.1']
Mamoru.Utils.delNotes = function(projectName, hostAddress){
    let delRes =  msfAPI.clientExec(['db.del_note', {workspace:projectName, host:hostAddress}]);
    return delRes
}

Mamoru.Utils.hostInfo = function(hostAddr){
    return msfAPI.clientExec(['db.get_host', {address:hostAddr}]).host
}

Mamoru.Utils.triggerEvent = function(type,username,details){
    Mamoru.Collections.Events.insert({type:type,triggeredBy:username,details:details,triggered:moment().format()})
}

Mamoru.Utils.getHostServices = function(hostAddress){
    return msfAPI.clientExec(['db.services', {addresses:hostAddress}]).services
}

Mamoru.Utils.getHostVulns = function(hostAddress){
    return msfAPI.clientExec(['db.vulns', {addresses:hostAddress}]).vulns
}

Mamoru.Utils.getHostNotes = function(hostAddress){
    return msfAPI.clientExec(['db.get_note', {address:hostAddress}]).note
}

Mamoru.Utils.currentProject = function(){
   return msfAPI.clientExec(['db.current_workspace']);  
}

Mamoru.Utils.projectInfo = function(projectName){
   return msfAPI.clientExec(['db.get_workspace', projectName]).workspace;  
}

Mamoru.Utils.addProject = function(projectName){
    return msfAPI.clientExec(['db.add_workspace', projectName]);
}

Mamoru.Utils.deleteProject = function(projectName){
    return msfAPI.clientExec(['db.del_workspace', projectName]); 
}

Mamoru.Utils.setProject = function(projectName){
    return msfAPI.clientExec(['db.set_workspace', projectName]);
}





/* not using this, but like the ability for reference...
function genDropdown(){
  //pretty awesome this GROUP BY SQL equivalent addToSet will find distcinct 'platforms', add them to an array and return it grouped by category
  var pipeline = [{$group:
                    {
                       _id: "$cat" ,
                       platforms: { $addToSet: "$platform" }
                    }
                  }];

var result = Mamoru.Collections.Modules.aggregate(pipeline);
//kinda rough but it works...adding icon class to each for drop down prettyness, going to prettyify strings too
for(var i=0; i < result.length; i++){
  if(result[i]._id == 'auxiliary'){
      result[i].icon = 'sitemap'
  } else if (result[i]._id == 'post') {
      result[i].icon = 'anchor'
  } else if (result[i]._id == 'exploit') {
      result[i].icon =  'crosshairs'
  } else if (result[i]._id == 'encoder'){
      result[i].icon = 'privacy' 
  }else if ( result[i]._id == 'nop') {
      result[i].icon = 'random'
  } else if (result[i]._id == 'payload') {
      result[i].icon = 'terminal'
  }
};

return result
}
*/