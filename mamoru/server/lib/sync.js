// to be used if new modules are added to MSF.
Mamoru.Sync.allModules = function(){
    var moduleFixtures = {
        exploit: 'module.exploits',
        post: 'module.post',
        auxiliary: 'module.auxiliary',
        payload: 'module.payloads',
        encoder: 'module.encoders',
        nop: 'module.nops',
    };
    // get module stats from MSF
    //var modStats = msfAPI.clientExec(Mamoru.API.client,['core.module_stats']);
    var fullModArray = [];
    for (key in moduleFixtures) {
        var modCatArray = msfAPI.clientExec([moduleFixtures[key]]);
        for(var i=0;i<modCatArray.length;i++){
            if(!moduleIsInMongo(modCatArray[i],key)){
                fullModArray.push({mod:modCatArray[i],cat:key})
            }
        }
    }; 

    var aJob = new Job(Mamoru.Collections.Jobs, 'syncModules', {modules:fullModArray});
    aJob.priority('high').save();
    Mamoru.Queues.fixtures.trigger();
}

// sync MSF workspaces with Mamoru projects
Mamoru.Sync.allProjects = function(){
    var tempConsole = Mamoru.Utils.createConsole()
    var msfWorkspacesObj = msfAPI.clientExec(['db.workspaces']);
    for(var i=0;i<msfWorkspacesObj.workspaces.length;i++){
        if(Mamoru.Collections.Projects.find({name:msfWorkspacesObj.workspaces[i].name}).count() === 0){
            Mamoru.Collections.Projects.insert(msfWorkspacesObj.workspaces[i]);
        }
    }
    Mamoru.Utils.destroyConsole(tempConsole.id);
}

Mamoru.Sync.Sessions = function(){
	var knownSessions = Mamoru.Collections.Sessions.find();
	var currentSessions = Mamoru.Utils.listSessions();
	var numSessions = Object.keys(currentSessions).length;
	 if(numSessions > 0){
	 	for(var k in currentSessions){
	 		if(Mamoru.Collections.Sessions.findOne({exploit_uuid: currentSessions[k]["exploit_uuid"] }) == undefined ){
                currentSessions[k]["startedAt"] = moment.now();
                currentSessions[k]["runBy"] = Meteor.users.findOne(Meteor.userId()).username;
                currentSessions[k]["sessionId"] = k;
                currentSessions[k]["established"] = true;
                Mamoru.Collections.Sessions.insert(currentSessions[k]);
	 		}
	 	}
	 } else {
	 	// set sessions as not established...
	 	var oldSessionsList = knownSessions.fetch()
	 	var updateObj = {established: false, stoppedAt: moment.now()}
	 	for(var i=0; i < oldSessionsList.length(); i++){
	 		Mamoru.Collections.Sessions.update({_id: oldSessionsList[i]._id }, {$set: updateObj });
	 	}
	 }
}


// used to compare mongo and pg records to determine if something needs to be syncronized..
function checkHost(msfRecord, mongoRecord){
    //console.log(msfRecord);
    var needsUpdate = false;
    var fieldsToUpdate = {}
    for(var key in msfRecord){
        if(msfRecord[key] != mongoRecord[key]){
            fieldsToUpdate[key] = msfRecord[key];
            needsUpdate = true; 
        }
    }
    var msfServices = Mamoru.Utils.getHostServices(msfRecord.address)
    if(msfServices){
       msfServices = msfServices.map((service)=>{
            delete service.host;
            return service;
        });   
    }
    if(msfServices.length != mongoRecord.services.length){
        needsUpdate = true; 
        fieldsToUpdate.services = msfServices;
    }

    var msfNotes = Mamoru.Utils.getHostNotes(msfRecord.address)
    if(msfNotes){
        msfServices = msfNotes.map((note)=>{
            delete note.host;
            return note;      
        });

    }

    if(msfNotes.length != mongoRecord.notes.length){
        needsUpdate = true;
        fieldsToUpdate.notes = msfNotes;
    }

    var msfVulns = Mamoru.Utils.getHostVulns(msfRecord.address)
    if(msfVulns){
       msfVulns = msfVulns.map((vuln)=>{
            delete vuln.host;      
            return vuln;  
        });
    }

    if(msfVulns.length != mongoRecord.vulns.length){
        needsUpdate = true;
        fieldsToUpdate.vulns = msfVulns;
    }

    return {needsUpdate:needsUpdate,toUpdate:fieldsToUpdate}
}



Mamoru.Sync.AllProjectHosts = function(projectName){
    let thisWorkspace = Mamoru.Collections.Projects.findOne({name:projectName});
    Mamoru.Utils.setProject(thisWorkspace.name);
    
    //get hosts array from msf
    let hostsObj = msfAPI.clientExec(['db.hosts', {}]);
    
    // loop hosts array
    for(var h=0;h<hostsObj.hosts.length;h++){
        
        let thisHost = Mamoru.Collections.Hosts.findOne({projectId:thisWorkspace._id, address:hostsObj.hosts[h].address});
        
        //if that host does not exist, retrieve hosts services and insert into mongo
        if(!thisHost){
            //set extra fields not returned directly from MSF for mongo organization / 'relationships'
            console.log(`syncing host ${hostsObj.hosts[h].address} from pg to mongo`)
            hostsObj.hosts[h].projectId = thisWorkspace._id
            // insert in mongo, which will trigger insert hook.
            Mamoru.Collections.Hosts.insert(hostsObj.hosts[h]);
        // else update according to what is in msf for the host 
        } else {
            console.log('host exists');
            var ch = checkHost(hostsObj.hosts[h],thisHost);
            // if MSF update_at date is not the same as mongos update_at date
            if(ch.needsUpdate) {
                console.log('host needs update');
                // will not trigger hook
                Mamoru.Collections.Hosts.direct.update(thisHost._id, {$set:ch.toUpdate});
            } 
        }
    }
}

Mamoru.Sync.projectHost = function(projectSlug, hostAddress){
    let thisWorkspace = Mamoru.Collections.Projects.findOne({slug:projectSlug});
    Mamoru.Utils.setProject(thisWorkspace.name);
    let hostFromMSF = Mamoru.Utils.hostInfo(hostAddress)[0];
    let thisHost = Mamoru.Collections.Hosts.findOne({projectId:thisWorkspace._id, address:hostAddress});
    //if that host does not exist, retrieve hosts services and insert into mongo
    if(!thisHost){
        //set extra fields not returned directly from MSF for mongo organization / 'relationships'
        hostFromMSF.projectId = thisWorkspace._id
        // insert in mongo, which will trigger insert hook.
        Mamoru.Collections.Hosts.insert(hostFromMSF);
    // else update according to what is in msf for the host 
    } else {
        console.log('host exists');
        var ch = checkHost(hostFromMSF,thisHost);
        if(ch.needsUpdate) {
            console.log('host needs update');
            // will not trigger hook
            Mamoru.Collections.Hosts.direct.update(thisHost._id, {$set:ch.toUpdate});
        } 
    }

}

Mamoru.Sync.ConsolePool = function(){
    var poolSize = Meteor.settings.consolePoolSize
    let currentConsoles = Mamoru.Utils.listConsoles();
    if(currentConsoles.consoles && currentConsoles.consoles.length != poolSize){
    try  {
        createConsolePool()
    }
    catch(err){
        console.log("whoa, creating console pool failed: try again in 5 seconds");
        Meteor.setTimeout(()=>{Mamoru.Sync.ConsolePool()}, 5000);
    }
    }
}
 // scoped to this file
 function createConsolePool(){
    var poolSize = Meteor.settings.consolePoolSize
    //check if there are existing consoles
    let existingConsoles = Mamoru.Utils.listConsoles();
    console.log(existingConsoles);
    let numExistingConsoles = existingConsoles.consoles.length
    console.log(`there are ${numExistingConsoles} existing consoles`);

    //array of existing console Ids according to MSF
    let existingConsoleMsfIds = existingConsoles.consoles.map((cons)=>{
        return cons.id;
    });
    // remove any consoles in mongo that do not have a matching MSF consoles
    let numConsolesRemoved = Mamoru.Collections.Consoles.direct.remove({msfId:{$nin:existingConsoleMsfIds}});
    if(numConsolesRemoved){
        console.log(`removed ${numConsolesRemoved} consoles, from the collection which do not match msf consoles`);
    }

    //remove extras consoles
    if(numExistingConsoles > poolSize){
        let consolesToRemove = existingConsoles.splice(0,existingConsoles-poolSize)
        for(let i=0;i<consolesToRemove.length;i++){
            let existsInMongo = Mamoru.Collections.Consoles.findOne({msfId:consolesToRemove[i].id});
            if(existsInMongo){
                Mamoru.Collections.Consoles.remove(existsInMongo._id);
            } else {
                Mamoru.Utils.destroyConsole(consolesToRemove[i].id);
            }
            console.log(`removed extra consoleId: ${consolesToRemove[i].id}`);
        }
    //add consoles if not enough
    } else if (numExistingConsoles < poolSize){
        for(; numExistingConsoles < poolSize; numExistingConsoles++){
            let newConsole = Mamoru.Collections.Consoles.insert({});
            let newConsoleId = Mamoru.Collections.Consoles.findOne(newConsole).msfId
            console.log(`added consoleId: ${newConsoleId} to the pool`);
        }
    //ensure msfIds are syncronized
    } else {
        Mamoru.Collections.Consoles.direct.remove({});
        existingConsoles.forEach((msfConsole)=>{
            Mamoru.Collections.Consoles.direct.insert(
                                                    {
                                                        msfId:msfConsole.id,
                                                        prompt:msfConsole.prompt,
                                                        busy:msfConsole.busy,
                                                        createdAt:moment().unix()
                                                    }
            );
        console.log(`synced consoleId: ${msfConsole.id}`);
        });

        
    }  
}


