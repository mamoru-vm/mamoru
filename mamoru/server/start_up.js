/*
ACTUAL START UP HERE
*/
Meteor.startup(function() {
    //if running meteor through test.sh TEST_MIRROR and an alternate MONGO_URL are set
    // need to work on tests a bit...
if(!process.env.IS_MIRROR){
    console.log('NOT TESTING');

    // create admin user
    Mamoru.Utils.createAdminUser()

    // import "cached" msf modules if they have not been already...
    importModules()
    // clear out Containers collection to be repopulated by loaded plugins
    
    // clear out old jobs...
    Mamoru.Collections.DepJobs.remove({});
    
    // create worker user, and start worker container to manage other containers
    MamoruMngr.initalizeWorker()

    // this is pretty nonsense..should probably get rid of it...
    // load meteor packages labeled as plugins
    createContainerDocs()

     //run check containers method
     // if the msf and pg containers are up, they will be initalized...
     Meteor.call("checkAllContainers");

// not really being used...but could be a way of tracking the containers that are launched or something..
  var count = 0;
   var query = Mamoru.Collections.Containers.find({up:true})
   var handle = query.observeChanges({
    added: function (id, container) {
    count++;
    console.log("container up! brings count to " + count);
  },
  removed: function () {
    count--;
    console.log("container down! brings count to " + count);
  },
  changed: function(id, fields){
        console.log(`container doc: ${id} changed fields:`)
        console.log(fields);
 }
});

//insert default project placeholder when we launch if it does not exist
// containers have not been started so msf default project has not been synced...
if(!Mamoru.Collections.Projects.findOne({name:"default"})){
  Mamoru.Collections.Projects.insert({name:"default"});
}

// After 10 seconds, stop keeping the count.
//Meteor.setTimeout(function () {handle.stop();}, 10000);


    // MOVE THIS TO ONCE MSF IS ACTUALLY SET...
    // clear existing msf consoles...
    //create or sync initial pool
   //Mamoru.Utils.createConsolePool()
    // set interval every 4 minutes ensuring console pool is alive
   // var consoleSync = Meteor.setInterval(Mamoru.Utils.syncConsolePool,270000);
          
   //create admin user based on meteor settings if they do not exist


        // sync mongo projects with / msf pg workspaces 
        //Mamoru.Utils.syncProjects();

        // for each project, sync hosts and associated services, vulns, notes
        //Mamoru.Collections.Projects.find().forEach(function (project) {
        //  Mamoru.Utils.syncAllProjectHosts(project.name)
        // }); 

    } else { // testing, mock as many api calls as possible..
        console.log("TESTING!!");
        // test default project
        if(!Mamoru.Collections.Projects.findOne({name:"default"})){
            Mamoru.Collections.Projects.insert({name:"default"});

        }
        Meteor.call('fixtures/seedUsers');
    }
    

  

});

/* yea this is kinda garbage as msf api does not like to actually store persistent tokens..kinda given up on it
// persistent tokens do not seem to work....
function setAppToken(){
     //init db through console
    var tempConsole = Mamoru.Utils.createConsole();
    var dbStatus = Mamoru.Utils.connectmsfDB();
    //generate token
    var token = msfAPI.genToken(Mamoru.API.client);
    console.log(token);
    var res = Mamoru.Utils.persistentToken(token);
    console.log(res);
    //destroy console after token has been inserted...
    Mamoru.Utils.destroyConsole(tempConsole.id)

    //recreate persistent session with permanent token for app

}
*/


function findValue(array, nameWeAreLookingFor) {
    for(var i = 0; i<array.length; i++) {
        if(array[i].name === nameWeAreLookingFor) return i;
    }
    return -1;
}

// places starup jobs on the DepJobs que, the worker handles these jobs
// not meteor main thread... 

function importModules(){
    // if the module data has not been inserted, insert it
    //need to fix this up an update module archive...
    if(Mamoru.Collections.Modules.find({}).count() === 0){
        // from custom mongo-import package
        mongoImport.importMods() 
    }

}

function createContainerDocs(){
  Mamoru.Collections.Containers.remove({});
  Mamoru.Utils.getPlugins()
  .forEach((plugin)=>{
    for(var k in plugin) { // Msf
      // check if plugin has docker images 
      // create container document for Containers collection
      if(plugin[k].dockerData){
          plugin[k].dockerData.forEach((containerInfo)=>{
            containerInfo.initalized = false;
            containerInfo.up = false;
            containerInfo.containerId = null;
            containerInfo.details = null;
            Mamoru.Collections.Containers.insert(containerInfo);
          });          
      }
    }
  });
}