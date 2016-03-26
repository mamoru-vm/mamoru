Mamoru.Utils.consoleRead = function(consoleId, callback){
  Meteor.call('msfCommand', ['console.read', consoleId], function(err,res){
    if(err || res.result === 'failure'){
      callback('Console does not exist')
    } else {
      callback(null, res);
    }
  });
}

// no good, only works on a single host...
Mamoru.Utils.enumHost = function(address,aggression,ports){
  var thisProject = Mamoru.Collections.Projects.findOne({slug:Session.get('currentProject')});
  var thisHost = Mamoru.Collections.Hosts.findOne({address:address, projectId:thisProject._id});
  Meteor.call('enumerateHost', address, aggression, ports, thisHost._id, function(err,res){
      if(!err){
         sAlert.info(`Starting Enumeration of ${address}...`);
          Tracker.autorun(function (c) {
            var enumJob = Mamoru.Collections.Jobs.findOne(res);
            if(enumJob.status === "completed"){
              Meteor.call('syncHost', thisProject.slug, address);
              Meteor.call('toggleHostEnumeration',thisHost._id, false);
              //delay for 1.5 s for host to sync before success msg
              Meteor.setTimeout(()=>{
                sAlert.success(`Enumeration of ${address} complete!`);
              }, 1500);
              c.stop();
              return;
            } else if (enumJob.status === "failed") {
              Meteor.call('toggleHostEnumeration',thisHost._id, false);
              sAlert.error(`Enumeration of ${address} failed`);
              console.log(enumJob.failures[0].reason);
              c.stop();
              return;
            }
          });
      }
  });
}