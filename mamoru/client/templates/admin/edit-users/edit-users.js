Template.editUsers.helpers({
  allUsers:function(){
    return Meteor.users.find();
  },
  notWorker: function(userInfo){
    return userInfo.username !== "worker" && userInfo.emails[0].address !== "worker@localhost"
  }
 
});

Template.editUsers.events({
  'click #addUser': function (event) {
    $('#newUserModal').modal('show');
  },
   'click #saveUser': function (event) {
    console.log('hi');
      $('#newUserForm').form('submit');
      //$('#newUserForm').form('validate form');
  }
});

Template.userTableRow.events({
  'click .removeUser': function (event) {
    var userToRemove = $(event.currentTarget).data('value')
    Meteor.users.remove(userToRemove);
  }
});

Template.userTableRow.helpers({
  getProjectNames: function (projectIds) {
   var projNames =  _.map(projectIds, function(id){
      var proj = Mamoru.Collections.Projects.findOne(id);
      return s.titleize(proj.name);
    });
    return projNames
  },
  getEmail: function (emails) {
    return emails[0].address
  },
  isMe: function(userId){
    if(Meteor.userId() === userId ){
      return 'disabled'
    }
  }
});

Template.projectsCell.helpers({
  getProjectName: function (id) {
    var proj = Mamoru.Collections.Projects.findOne(id);
    return s.titleize(proj.name);
  }
});