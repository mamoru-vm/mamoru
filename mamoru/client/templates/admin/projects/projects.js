Template.adminProjects.helpers({
  allUsers:function(){
    return Meteor.users.find({});
  },
  allProjects:function(){
    return Mamoru.Collections.Projects.find();
  },
  selectedProjectName: function(){
    var projId = Session.get("selectedProject")
    return Mamoru.Collections.Projects.findOne(projId).name
  },
  getEmail: function (emails) {
    return emails[0].address
  },

  countProjects:function(projects){
    return 2 + projects.count()
  },
  isAllowed: function(projectId, userProjects){
    if(userProjects.indexOf(projectId) >= 0){
      return 'checked'
    } else {
      return ""
    }
  }
});

Template.adminProjects.events({
  'click #addProject': function () {
    $('#newProjModal').modal('show');
  }
});

Template.permissionCell.helpers({
   isAllowed: function(projectId, userProjects){
    if(userProjects.indexOf(projectId) >= 0){
      return 'checked'
    } else {
      return ""
    }
  }
});

Template.permissionCell.onRendered(function(){

    $('.ui.fitted.checkbox.permission').checkbox({
    onChecked: function(){
      console.log(this.id);
      var idArray = this.id.split("-")
      var projectId = idArray[0]
      var userId = idArray[1]
      Meteor.users.update({_id:userId},{$push:{projects:projectId}});
    },
    onUnchecked: function(){
       console.log(this.id);
      console.log('unchecked')
      var idArray = this.id.split("-")
      var projectId = idArray[0]
      var userId = idArray[1]
      Meteor.users.update({_id:userId},{$pull:{projects:projectId}});
    }
  });

});


Template.adminProjects.onRendered(function(){
  /*
  $('.ui.fitted.checkbox.permission').checkbox({
    onChecked: function(){
      console.log(this.id);
      var idArray = this.id.split("-")
      var projectId = idArray[0]
      var userId = idArray[1]
      Meteor.users.update({_id:userId},{$push:{projects:projectId}});
    },
    onUnchecked: function(){
       console.log(this.id);
      console.log('unchecked')
      var idArray = this.id.split("-")
      var projectId = idArray[0]
      var userId = idArray[1]
      Meteor.users.update({_id:userId},{$pull:{projects:projectId}});
    }
  });
*/
});

Template.projectTableRow.helpers({
  isDefaultOrCurrentProject:function(projectSlug){
    if(projectSlug === 'default' || Session.equals('currentProject', projectSlug)){
      return 'disabled'
    } else {
      return ''
    }
  }
});

Template.projectTableRow.events({
  'click .project-row': function (event) {
    var projId = $(event.currentTarget).data('value')
    Session.set("selectedProject",projId)
  },
  'click .removeProject': function (event) {
    var projName = $(event.currentTarget).data('value')
    Meteor.call('removeProject', projName, function(err,res){
        if(err){
          console.log(err)
        } else {
          console.log(res)
        }
    });
  },

});