// do not run this hook in the test mirror...
if (!process.env.IS_MIRROR) {
  Mamoru.Collections.Projects.before.insert(function(userId, doc){
      // for when created on the server
      if(!userId){
          doc.createdBy = 'server';
          doc.created_at = moment.unix(doc.created_at).format();
          doc.updated_at = moment.unix(doc.updated_at).format();
          doc.id = doc.id;
          doc.slug = s.slugify(doc.name);
      
      // for when created on the client
      } else {
        var newProj = Mamoru.Utils.addProject(doc.name);

        if(newProj.result === 'success'){
          var projInfo = Mamoru.Utils.projectInfo(doc.name)[0]
          doc.created_at = moment.unix(projInfo.created_at).format();
          doc.updated_at = moment.unix(projInfo.updated_at).format();
          doc.id = projInfo.id;
          doc.createdBy = userId;
          doc.slug = s.slugify(doc.name);
          // giver access to project to all admins.
          Roles.getUsersInRole('admin').forEach(function (user) {
              Meteor.users.update({_id:user._id},{$push:{projects:doc._id}});
          });
        } 
        
      }
  });

  Mamoru.Collections.Projects.after.remove(function(userId, doc){
     Mamoru.Utils.deleteProject(doc.name);

 
  });

} else {
  // if mirror create dummy project values on create
   Mamoru.Collections.Projects.before.insert(function(userId, doc){
    doc.slug = s.slugify(doc.name);
    doc.created_at = moment.unix().format();
    doc.id = "1";
    doc.createdBy = userId || 'server'
    Roles.getUsersInRole('admin').forEach(function (user) {
        Meteor.users.update({_id:user._id},{$push:{projects:doc._id}});
    });

   });

}