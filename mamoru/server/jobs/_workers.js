fixtureWorkers = function (job, callback) {
    if (job.type === 'syncModules') {
        Mamoru.API.syncModules(job.data.modules, job);

        job.done();
        callback();
    } else if(job.type === 'syncProjectData'){
      

        job.done();
        callback();
    }
};


apiCallWorker = function (job,cb){
    if(job.type === 'apiCall'){
        var command = job.data.command
        msfAPI.clientExecJob(command, (err,res)=>{
            if(err){
                job.fail({reason:`API Call Failed: ${command}`, code:1}, {fatal:true});
                cb();
            } else {
                job.done(res)
                cb();
            }
        })
    } else if(job.type === 'exploitCheck'){
        var checkTimeout = Meteor.setTimeout(()=>{
            Meteor.clearInterval(checkInterval);
            job.log("been one minute, session aint happening");
            job.fail("timed out, no session...");
            cb();
        }, 30000); // after 30 seconds clear interval an fail job?
        var checkInterval = Meteor.setInterval(()=>{
            checkSession(job,cb, checkTimeout, checkInterval);   //check every 5 seconds;
        }, 2500); // every 2.5 seconds
        checkSession(job, cb,checkTimeout, checkInterval); // check right away;
    }

}

function checkSession(job, cb, timeout, interval ){
    var exploitUUID = job.data.exploitUUID;
    var runBy = job.data.userID;
    var currentSessions = Mamoru.Utils.listSessions();
    var numSessions = Object.keys(currentSessions).length;
    if(numSessions > 0){
        for(var k in currentSessions){
            if(currentSessions[k]["exploit_uuid"] == exploitUUID){
                job.log("session uuid matches exploit job uuid, session up!");
                currentSessions[k]["startedAt"] = moment.now();
                currentSessions[k]["runBy"] = runBy;
                currentSessions[k]["sessionId"] = k;
                currentSessions[k]["established"] = true;
                Mamoru.Collections.Sessions.upsert(currentSessions[k]); // insert record into session collection
                job.done("session up!");
                cb();
                Meteor.clearTimeout(timeout); // clear timeout 
                Meteor.clearInterval(interval);    // clear interval
            }
        }
    } else {
        job.log("no sessions up yet!");
    }
}



consoleActionWorker = function (job,callback){
    let consoleId = Mamoru.Collections.Consoles.findOne({busy:false}).msfId;
    let command = job.data.command
    Mamoru.Collections.Consoles.update({msfId:consoleId},{$set:{busy:true, assignedTo:job.data.userId}});
    let write = Mamoru.Utils.consoleWrite(consoleId, command);
    var progress = 0
    if(write.result === 'failure'){
        Mamoru.Collections.Consoles.update({msfId:consoleId},{$set:{busy:false, assignedTo:null}});
        job.fail({reason:`console.write API Call Failed: ${job.data.command}`, code:1}, {fatal:true});
        callback()
    } else {
        progress = progress + 1
        job.progress(progress,100);
        var result = Mamoru.Utils.consoleRead(consoleId);
        if(result.data){
            job.log(result.data, {level:'success'});
        }
        if(result.busy === true){
            //poll the console for result.busy === false, which indicates command has finished running
            var pollConsole = Meteor.setInterval(()=>{
                var result = Mamoru.Utils.consoleRead(consoleId);
                //do not let progress go above 100
                progress = (progress >= 99) ? 99 : progress + 1
                job.progress(progress, 100);
                if(result.data){
                    job.log(result.data, {level:'success'});
                }
                if(result.busy === false){
                    Mamoru.Collections.Consoles.update({msfId:consoleId},{$set:{busy:false, assignedTo:null}});
                    Meteor.clearInterval(pollConsole);
                    job.done();
                    callback();
                }

            }, 2250);
        } else {
            job.done();
            callback();
        }
    }
}


waitForExploitWorker = function(job,cb){
    




}