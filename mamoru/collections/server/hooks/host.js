
// not testing mirror
if (!process.env.IS_MIRROR) {
  Mamoru.Collections.Hosts.before.insert((userId, doc)=>{
    // test if should add to MSF through API call
    if(doc.created_at){
      var addToMSF = false
    }
    // if it was added by the server at startup through a 'db.hosts' call
    if(!userId){
      doc.addedBy = 'server';
    } else {
    // it was added by a user, through a meteor method, or client insert
      let userName = Meteor.users.findOne(userId).username;
      doc.addedBy = userName;
    }

    //
    let name = doc.name || ""
    
    // if we do not need to make an API call, just change time format this is because host info is returned from db.hosts
    if(!addToMSF) {
      //get stuff about host already in MSF
      let servicesToInsert = Mamoru.Utils.getHostServices(doc.address).map((service)=>{
        delete service.host;
        return service;
      });


      let notesToInsert = Mamoru.Utils.getHostNotes(doc.address).map((note)=>{
        delete note.host;
        return note;
      });

     let vulnsToInsert = Mamoru.Utils.getHostVulns(doc.address).map((vuln)=>{
        delete vuln.host;      
        return vuln;  
    });

      doc.services = servicesToInsert;
      doc.notes = notesToInsert;
      doc.vulns = vulnsToInsert;
      doc.credentials = [];
      doc.browsers = [];
      
     
    } else {
         // make API call for manual host entry
        let newHost = Mamoru.Utils.addHost({
                                host:doc.address,
                                name:name,
                                info:doc.info || "",
                                state: doc.state || "unknown",
                                os_name:doc.os_name || "",
                                os_flavor:doc.os_flavor || "",
                                os_lang:doc.os_lang || "",
                                arch: doc.arch || "",
                                mac: doc.mac || "",
                                scope: doc.scope || "",
                                purpose:doc.purpose || "",
                                virtual_host:doc.virtual_host || ""
                              });
        doc.name = name;
        doc.created_at = newHost.created_at;
        doc.updated_at = newHost.updated_at
        doc.services = []
        doc.notes = []
        doc.credentials = []
        doc.browsers = []
        doc.vulns = []
    }

    Mamoru.Utils.triggerEvent('addedHost',doc.addedBy,{address:doc.address,name:name})

  });

  Mamoru.Collections.Hosts.before.remove((userId,doc)=>{
    var projectName = Mamoru.Collections.Projects.findOne(doc.projectId).name
    var delHost = Mamoru.Utils.delHost(projectName, doc.address);
    if(delHost.result === 'failed'){
      return false
    } else {
      Mamoru.Utils.triggerEvent('removedHost',doc.addedBy,{address:doc.address})
    }
  });


 Mamoru.Collections.Hosts.before.update((userId, doc,fieldNames, modifier, options)=>{
  var projectName = Mamoru.Collections.Projects.findOne(doc.projectId).name
  var toUpdate = {host:doc.address}
  console.log(modifier);
  console.log(fieldNames);

  for(let i=0;i<fieldNames.length;i++){
    if(Mamoru.Utils.inArray(fieldNames, 'services')){
      console.log('update services...')
      if(modifier.$push){
        let serviceToUpdate = modifier.$push.services
        console.log('add service: ' + JSON.stringify(serviceToUpdate));
      } else if (modifier.$pull){
        let serviceToUpdate = modifier.$pull.services
        let serviceHost = doc.address
        let workspaceName = Mamoru.Collections.Projects.findOne(doc.projectId).name
        console.log('delete service: ' + JSON.stringify(serviceToUpdate));
        console.log(serviceHost);
        let deleteRes = Mamoru.Utils.delService(serviceHost,serviceToUpdate);
        console.log(deleteRes);

      }
    } else if(Mamoru.Utils.inArray(fieldNames, 'notes')){
        console.log('update notes...')
    } else if(Mamoru.Utils.inArray(fieldNames, 'browsers')){
        console.log('update browsers...')
    } else if(Mamoru.Utils.inArray(fieldNames, 'credentials')) {
        console.log('update credentials...')
    } else if (Mamoru.Utils.inArray(fieldNames, 'vulns')) {
       console.log('update vulns...');
    } else {
      toUpdate[fieldNames[i]] = modifier.$set[fieldNames[i]]
      var updatedHost = Mamoru.Utils.addHost(toUpdate);
      if(updatedHost){
        modifier.$set.updated_at = updatedHost.updated_at
      }
    }
  }
 
  console.log(modifier);

 });




}