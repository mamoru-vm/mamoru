Meteor.publish("all-modules", function (searchString) {
  if (!searchString) {
    return Mamoru.Collections.Modules.find({},{fields:{name:1,cat:1,path:1,rank:1,platform:1}}); // everything
  } 
  return Mamoru.Collections.Modules.find({ $text: {$search: searchString}},{fields:{name:1,cat:1,path:1,rank:1,platform:1,score:{$meta:"textScore"}},sort:{score: {$meta:"textScore"}}});
});


Meteor.publish("module", function (moduleId) {
  var aMod = Mamoru.Collections.Modules.findOne(moduleId,{fields:{options:0}});
  if(aMod.cat == 'exploit'){
    var modPayloads = aMod.payloads
    delete aMod.payloads;
    this.added('modules', moduleId, aMod)
      modPayloads.forEach((PLPath)=>{
          var aPLMod = Mamoru.Collections.Modules.findOne({path:PLPath},{fields:{path:1, cat: 1}});
          this.added('modules', aPLMod._id, aPLMod);
      });
  } else {
     this.added('modules', moduleId, aMod)
  }
  this.ready();
});

Meteor.publish('module-options', function (moduleId) {
  var mod = Mamoru.Collections.Modules.findOne(moduleId)
  var modOptions = mod.options
    for(var k in modOptions){
      // this double semi colon is not well liked as a JS module param i.e {HTTP::URI: 'asdasd'} 
      // sanitize as underscores for better use within Semantic UI form object where field name is an object param
      var splitOnColons = k.split("::");
      var cleanName = k;
      if(splitOnColons.length > 1){
        var cleanName = splitOnColons.join("_")
      }
      
      modOptions[k].name = cleanName
      modOptions[k].payload_opt = false
      this.added('moduleOptions', Random.id(), modOptions[k]);
    }
    this.ready();
});

Meteor.publish('payload-options', function (payloadId) {
  if(payloadId){
    var payload = Mamoru.Collections.Modules.findOne(payloadId)
    var payloadOpts = payload.options
    for(var key in payloadOpts){
      var splitOnC = key.split("::");
      var cn = key;
      if(splitOnC.length > 1){
        var cn = splitOnC.join("_")
      }
        payloadOpts[key].name = cn
        this.added('payloadOptions', Random.id(), payloadOpts[key]);
    }
    
    this.ready();
  } else {
    this.ready
  }

});


//ReactiveTable.publish("modules-table-all", Mamoru.Collections.Modules ,{},{fields:{name:1,cat:1,path:1,rank:1,platform:1}});

Meteor.publish("filtered-modules", function (category, platform) {
  if (platform){
    return Mamoru.Collections.Modules.find({cat:category, platform:platform},{fields:{name:1,cat:1,path:1,rank:1,platform:1}}); // filtered on category and platform
  } else {
    return Mamoru.Collections.Modules.find({cat:category},{fields:{name:1,cat:1,path:1,rank:1,platform:1}}); // filtered on category 
  }
  
});

Meteor.publish("all-projects", function () {
  if(this.userId){
  if(Roles.userIsInRole(this.userId, 'admin')){
     return Mamoru.Collections.Projects.find();
  } else {
    var userProjects = Meteor.users.findOne(this.userId);
    return Mamoru.Collections.Projects.find({_id:{$in:userProjects.projects}});
  } 
}
});


Meteor.publish("scanner-modules", function () {
  if(this.userId){
     var scanModuleNames = [
       'TCP SYN Port Scanner',
       'TCP "XMas" Port Scanner',
       'TCP Port Scanner',
       'TCP ACK Firewall Scanner',
       'UDP Service Sweeper',
       'UDP Service Prober',
       'UDP Empty Prober',
       'NAT-PMP External Address Scanner'
    ];
  return Mamoru.Collections.Modules.find({name:{$in:scanModuleNames}}, {fields:{_id:1,name:1}})
}
});


Meteor.publish("all-jobs", function () {
  return Mamoru.Collections.Jobs.find({},{fields:{progress:1, log:1, status:1, data:1}})
});

Meteor.publish("api-jobs", function () {
  return Mamoru.Collections.ApiJobs.find({},{fields:{progress:1, log:1, status:1, data:1}})
});

Meteor.publish("all-users", function () {
  if(Roles.userIsInRole(this.userId, 'admin')){
    return Meteor.users.find({},{fields:{profile:1,username:1,emails:1,projects:1,roles:1}});
  } 
});

Meteor.publish("all-containers", function () {
  if(Roles.userIsInRole(this.userId, 'admin')){
    return Mamoru.Collections.Containers.find({});
  } 
});

Meteor.publish("containers-state", function () {
    return Mamoru.Collections.Containers.find({},{fields: {name:1, up:1, initalized: 1}});
});

Meteor.publish("userProfile", function (userName) {
  if(this.userId){
    return Meteor.users.find({username:userName},{fields:{profile:1,username:1,emails:1}});
  } 
});

Meteor.publish("project-hosts", function (projectSlug) {
   if(this.userId){
    var projectId = Mamoru.Collections.Projects.findOne({slug:projectSlug})._id
    return Mamoru.Collections.Hosts.find({projectId:projectId})
  } 
});

Meteor.publish("host", function (projectSlug, hostId) {
   if(this.userId){
    var projectId = Mamoru.Collections.Projects.findOne({slug:projectSlug})._id
    return Mamoru.Collections.Hosts.find({_id:hostId, projectId:projectId})
  } 
});

Meteor.publish("project-services", function (projectSlug) {
   if(this.userId){ // should also check this user has access to project...
    return Mamoru.Collections.Services.find({workspace:projectSlug})
  } 
});

Meteor.publish("project-sessions", function (projectSlug) {
   if(this.userId){ // should also check this user has access to project...
    //var projectId = Mamoru.Collections.Sessions.findOne({slug:projectSlug})._id
    return Mamoru.Collections.Sessions.find({workspace:projectSlug})
  } 
});

Meteor.publish('depJobs', function () {
  return Mamoru.Collections.DepJobs.find({});
});

