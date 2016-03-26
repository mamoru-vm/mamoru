Accounts.onCreateUser(function(options, user) {
  if (options.profile.roles){
    if (options.profile.roles.indexOf("admin") > -1) {
     var defaultProjIds = Mamoru.Collections.Projects.find().map(function(proj){return proj._id});
     user.projects = defaultProjIds
     user.profile = {}
    } else if(options.profile.roles.indexOf("user") > -1) {
      var defaultProjId = Mamoru.Collections.Projects.findOne({name:'default'})._id;
      user.projects = [defaultProjId];
      user.profile = {}
    }
  } else {
    throw new Meteor.Error("Cannot create a user without a role, admin, user, or worker")
  }
  return user;
});