
function checkPG(){
  if(Object.keys(Mamoru.Configs).lenght == 2 ){
    Msf.PGdb.Host.findOne().then((host)=>{
    //Mamoru.Status.pg = 'up';
    console.log("MSF DB is good!");
    }).catch((err)=>{
        console.log(err);
        console.log("whoaa SQL down?");
        //Mamoru.Status.pg = 'down';
    });
  }
}

function checkMsf(){
    try {
        var v = msfAPI.clientExec('core.version');
        //Mamoru.Status.msf = 'up';
        console.log(v);
        console.log("MSF API is good!");
        //Meteor.clearInterval(Mamoru.Intervals.checkMSF);
    } catch(err){
        console.log("whoops. API isnt working...");
        //Mamoru.Status.msf = 'down';
    }
}

function checkDep (name){
  if(name == 'metasploit'){
    checkMsf()
  } else {
    checkPG()
  }
}

// not using this anymore. thinking of another approach...
function setAndInitConfig(result){
    const containerName = result.Name
    Mamoru.Configs[containerName] = {Id: result.Id, IP: result.IP, State: result.State, Ports: result.Ports, Env: result.Env}
    if(containerName == 'metasploit'){
      Msf.initMetasploit()

      console.log("creating console pool in 2.5 secs")
      Meteor.setTimeout(Mamoru.Utils.createConsolePool, 2500)
    } else {
      Msf.initPostgres()
    }
}

// check if container IDs are the same, return true if they are
function sameConfig(result){
  if(Mamoru.Configs[result.Name]){
    return result.Id == Mamoru.Configs[result.Name].Id
  } else {
    return true // ?? 
  }
  
}
/*
jobDone Handles
*/

Mamoru.Collections.Jobs.events.on('jobDone', function(msg) {
    if (!msg.error) {
        console.log("Job " + msg.params[0] + " finished!");
    };
});

Mamoru.Collections.DepJobs.events.on('jobDone', function (msg) {
    if (!msg.error) {
      const thisJob = Mamoru.Collections.DepJobs.getJob(msg.params[0])
      // depending on job data, final retrieve job doc with different selectors
     const containerSelector = (thisJob.doc.data.containerId != null) ? {containerId:thisJob.doc.data.containerId} : {name:thisJob.doc.data.label}
     const containerDoc = Mamoru.Collections.Containers.findOne(containerSelector);

    if(thisJob.type == "containerCheck"){

      if(thisJob.data.type == 'start'){
       var updateObj = {up: thisJob.doc.result.up, details: thisJob.doc.result.details}
       Mamoru.Collections.Containers.update(containerDoc._id,{$set: updateObj});
        //setAndInitConfig(thisJob.result);
        //console.log("start job complete, initalize and test:" + thisJob.result.Name);
      } else if(thisJob.data.type == 'check'){
        //console.log(thisJob.doc.result)
        if(thisJob.doc.result.up){
          // container is up
          //set some stuff immediatly in mongo 
         Mamoru.Collections.Containers.update(containerDoc._id,{$set: {containerId:thisJob.doc.result.containerId, up: true, details: thisJob.doc.result.details }} );       
         // get array of mamoru-plugins
          if(!containerDoc.initalized){
             Mamoru.Utils.getPlugins()
             .forEach((plugin)=>{
              // if the job that finished is for this plugin
              if(plugin[Object.keys(plugin)[0]].name == containerDoc.plugin){
                //run the init function associated with this container - for initalizaing msfclient for example.
                  console.log("initalizing: " + containerDoc.name)
                  //pass container details to init function, so it can use IP 
                  plugin[Object.keys(plugin)[0]].init[containerDoc.name](thisJob.doc.result.details);
                  Mamoru.Collections.Containers.update(containerDoc._id,{$set: {initalized: true}});
              }
              });
            }
        } else if(thisJob.doc.result.containerId) { //not up
          //container exists, we have its ID, and some other stuff, but not gonna init...
          var updateObj = {details: thisJob.doc.result.details, containerId: thisJob.doc.result.containerId}
          Mamoru.Collections.Containers.update(containerDoc._id,{$set: updateObj});
        } 
      } else if(thisJob.data.type == 'stop'){
         var updateObj = {up: false, details: null}
         Mamoru.Collections.Containers.update(containerDoc._id,{$set: updateObj} ); 

      } else if(thisJob.data.type == 'restart'){
        var updateObj = {up: true, restarting: false}
        Mamoru.Collections.Containers.update(containerDoc._id,{$set: updateObj} ); 

      } else if(thisJob.data.type == 'remove'){
        var updateObj = {up: false, containerId: null, details: null}
        Mamoru.Collections.Containers.update(containerDoc._id,{$set: updateObj} ); 

      } else if(thisJob.data.type == 'create'){
        var updateObj = {up: false, containerId: thisJob.doc.result.Id}
        Mamoru.Collections.Containers.update(containerDoc._id,{$set: updateObj} );
      }

/*
       else {
        if(!sameConfig(thisJob.result)){
          console.log("container ID has changed, resetting config");      
          setAndInitConfig(thisJob.result);
        } else {
          console.log("container ID is the same test if everything is cool");
          checkDep(thisJob.data.name);
        }
      }
      */
      //console.log(Mamoru.Configs);
    }
      // clean up after running the job, after a minute just incase result is slow to be retrieved...
      console.log("Job " + msg.params[0] + " finished!");
      Meteor.setTimeout(()=>{
        thisJob.remove()
      } , 60000);
    }
  })

/*
jobRemove Handles
*/
Mamoru.Collections.DepJobs.events.on('call', (msg)=>{
 if (msg.method === 'jobRemove') {
      console.log("Job " + msg.params[0] + " removed!");
    }
});