Meteor.methods({


checkContainer: function(containerId){
    var containerDoc = Mamoru.Collections.Containers.findOne(containerId);
    var checkJob;
     if(!containerDoc.containerId){
         console.log("Running check for: " + containerDoc.name);
        checkJob =  new Job(Mamoru.Collections.DepJobs, 'containerCheck', {type: "check", label:containerDoc.name, Id: null}).save()
    } else {
        console.log("Running check for: " + containerDoc.containerId);
        checkJob =  new Job(Mamoru.Collections.DepJobs, 'containerCheck', {type: "check", label:containerDoc.name, Id: containerDoc.containerId}).save()
    }
  return checkJob;        
},

checkAllContainers: function(){
  var jobs = []
   Mamoru.Collections.Containers.find()
   .forEach((containerDoc)=>{
        var job;
        if(!containerDoc.containerId){
            console.log("Running check for: " + containerDoc.name);
           job =  new Job(Mamoru.Collections.DepJobs, 'containerCheck', {type: "check", label:containerDoc.name, Id: null}).save()
        } else {
            console.log("Running check for: " + containerDoc.containerId);
           job = new Job(Mamoru.Collections.DepJobs, 'containerCheck', {type: "check", label:containerDoc.name, Id: containerDoc.containerId}).save()
        } 
        jobs.push(job);       
   });
   return jobs
},

createContainer: function(id){
   var container = Mamoru.Collections.Containers.findOne(id);
   Mamoru.Collections.Containers.update(container._id, {$set:{creating: true}}); 
   var job1 = new Job(Mamoru.Collections.DepJobs, 'containerCheck', {type: "create", label:container.name, config:container.config}).save()
   createJob = Mamoru.Collections.DepJobs.getJob(job1);
   var job2 = new Job(Mamoru.Collections.DepJobs, 'containerCheck', {type: "check", label:container.name, Id: null}).depends([createJob]).save();
   return job2
  },

startContainer: function(id){
    var container = Mamoru.Collections.Containers.findOne(id);
    var job1 = new Job(Mamoru.Collections.DepJobs, 'containerCheck', {type: "start", containerId:container.containerId}).save()
    return job1
  },

stopContainer: function(id){
    var container = Mamoru.Collections.Containers.findOne(id);
    Mamoru.Collections.Containers.update(container._id, {$set:{up: false, initalized: false, details: null}}); 
    var job1 = new Job(Mamoru.Collections.DepJobs, 'containerCheck', {type: "stop", containerId:container.containerId}).save()
    return job1
  },

restartContainer: function(id){
    var container = Mamoru.Collections.Containers.findOne(id);
    Mamoru.Collections.Containers.update(container._id, {$set:{restarting: true, up: false, initalized: false}}); 
    var job1 = new Job(Mamoru.Collections.DepJobs, 'containerCheck', {type: "restart", containerId:container.containerId}).save()
    return job1
  },

removeContainer: function(id){
    var container = Mamoru.Collections.Containers.findOne(id);
    Mamoru.Collections.Containers.update(container._id, {$set:{up: false, details: null}}); 
    var job1 = new Job(Mamoru.Collections.DepJobs, 'containerCheck', {type: "remove", containerId:container.containerId}).save()
    return job1
  }

});