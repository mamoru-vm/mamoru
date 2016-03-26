//No module rules atm...probably not going to allow the client to touch em...
//Modules.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();

// example from ongoworks docs https://atmospherejs.com/ongoworks/security
Security.defineMethod("ifIsCurrentUser", {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    return userId !== doc._id;
  }
});

// example from ongoworks docs https://atmospherejs.com/ongoworks/security
Security.defineMethod("ifInProject", {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    let userProjects = Meteor.users.findOne(userId).projects;
    return !Mamoru.Utils.inArray(userProjects, doc.projectId)
  }
});


// admins can edit, add and remove projects
Mamoru.Collections.Projects.permit(['insert', 'update', 'remove']).ifLoggedIn().ifHasRole('admin').apply();

// admins can edit update and remove users
Meteor.users.permit(['insert', 'update', 'remove']).ifLoggedIn().ifHasRole('admin').apply();

// all users can edit hosts
Mamoru.Collections.Hosts.permit(['insert', 'update', 'remove']).ifLoggedIn().ifInProject().apply();

// users can update their own records
Meteor.users.permit(['update']).ifLoggedIn().ifIsCurrentUser().apply();

Mamoru.Collections.DepJobs.allow({
  
  worker: function(userId, method, params){
    return true
  },
  getWork: function(userId, method, params){
    return true
  },
  insert: function (userId, doc) {
     return Roles.userIsInRole(userId, 'admin');
  },
  update: function (userId, doc, fields, modifier) {
    return Roles.userIsInRole(userId, 'admin');
  },
  remove: function (userId, doc) {
    return Roles.userIsInRole(userId, 'admin');
  }
});