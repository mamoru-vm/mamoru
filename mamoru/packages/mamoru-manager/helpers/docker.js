var Docker = Npm.require('dockerode');

var docker = new Docker();  



initalizeWorker = function (){
   if(!Accounts.findUserByEmail("worker@localhost")){
    Mamoru.Utils.createUser("worker@localhost",
                        Meteor.settings.workerPass,
                        {role:"worker"}
                        );
    } else {
    console.log("worker user exists")
    }


  const workerConfig = {
    name: 'mamoru-worker',
    Labels: {"mamoru": "worker"},
    Image:'mamoru/dependency-worker',
    Env: [
          "WORKER_USERNAME=worker",
          "WORKER_PASSWORD=" + Meteor.settings.workerPass
         ],
    HostConfig: {
                  Binds: ['/var/run/docker.sock:/var/run/docker.sock'],
                  ExtraHosts: ["manager:" + Meteor.settings.docker0IP] // need to get the IP of docker0 interface dynamically..cannot use os.networkInterces...
                }
    }
   
   const upRegex = /^Up .*$/

   var workerContainer = findContainerAsync("mamoru=worker");
   // create worker container if one does not exist
   if(workerContainer.length == 0){
      console.log('creating new worker container')
       var launchWorkerJob = new Job(Mamoru.Collections.DepJobs,
                                 'startWorker',
                                 {
                                    imageRepoPath: 'mamoru/dependency-worker',
                                    runConfig: workerConfig,

                                 })
        launchWorkerJob.save()
        // worker exists but is not up
   } else if(workerContainer.length == 1 && !upRegex.test(workerContainer[0].Status)){
        console.log('worker exits, starting...')
        startContainerAsync(workerContainer[0].Id);
   } else {
    console.log('worker running, do not need to create or start it...')
   }
}


function findContainer(label, callback){
  docker.listContainers({all:true, filters:{"label":[label]}}, (err,containers)=>{
    if(!err){
      callback(null,containers);
    } else {
      callback(err,err)
    }
  });
}


createContainerJob =  function (job, cb){
    docker.createContainer(config, (err, container)=>{
        if(!err){
          callback(null, container);
          //console.log(container);
        } else {
          callback(err,err);
         // console.log(err)
        }
    });
}


function startContainer(containerId, callback){
  var container = docker.getContainer(containerId);
  container.start(Meteor.bindEnvironment((err, data)=>{
      if(!err){
        callback(null, data);
      } else {
        callback(err,err);
      }
   }))
}

function createContainer(config, callback) {
  docker.createContainer(config, Meteor.bindEnvironment((err, container)=>{
    if(!err){
       callback(null,container);
    } else {
      callback(err,err);
    }

  }))
}


function findImage(imageName, callback){
  docker.listImages({filter: imageName}, (err, images)=>{
    if(!err){
      callback(null, images);
    } else {
      callback(err,err);
    }
    
  })
}


findImageAsync = Async.wrap(findImage);
findContainerAsync = Async.wrap(findContainer);
createContainerAsync = Async.wrap(createContainer)
startContainerAsync = Async.wrap(startContainer);

launchImageJob = function(job, cb){
  const imageRepoPath = job.data.imageRepoPath;
  const runConfig = job.data.runConfig;
  const imageTag = job.data.runConfig.Image

  docker.pull(imageRepoPath, Meteor.bindEnvironment((err, stream)=>{
    var prog=0
    if(!err){
      docker.modem.followProgress(stream, Meteor.bindEnvironment(onFinished), Meteor.bindEnvironment(onProgress));     
    } else {
        job.log("error: " + err, {level:'danger', echo:true});
        job.fail();
    }

    function onProgress(event) {
      if(prog != 200){
        prog++
      }
      job.progress(prog, 200)
       //console.log(event.stream); // console output
       //job.log(event);
    }

      function onFinished(err, output) {
        job.log('pulled image!', {echo:true})
        if(!err){
          //console.log(output);
          var container = createContainerAsync(runConfig);
          job.log('container created '+ container.id, {echo:true})
          var data = startContainerAsync(container.id);
          job.log('container started', {echo:true})
          job.done(data);
        } else {
         job.log("error: " + err, {level:'danger', echo:true});
         job.fail();
        }
      }

}));
cb()
}