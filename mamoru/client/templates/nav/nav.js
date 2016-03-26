Template.Navbar.onCreated(function(){
  this.subscribe('all-projects');
});




Template.Navbar.onRendered(function(){
    //init nav dropdowns (semantic-ui)
    $('#projectsNav').dropdown({action: 'hide'});
    $('#controlPanelNav').dropdown({action: 'hide'});
    $('#thisProjectNav').dropdown({action:'hide'});
    $('#modulesNav').dropdown({action:'hide'});
});


Template.Navbar.helpers({
  projects: function () {
      return Mamoru.Collections.Projects.find().fetch();
  },
  projUrl: function(){
    return "/projects/discover/" + this.slug
  },
  initProjects: function(){
    $('#projectsNav').dropdown({action: 'hide'});
  }
});


Template.Navbar.events({
  'click #editProjectsNav':function(event){
    console.log("clicked edit project nav dropdown");
  },
  'click #editUsersNav':function(event){
    console.log("clicked edit users nav dropdown");
  },
  'click #logoutBtn':function(event){
      Meteor.logout(function(err){
        if(err){
         console.log(err) 
        } else {
          FlowRouter.go('/login');
        }
      });
  },
  'click #userProfile':function(event){
     FlowRouter.go('/profile/' + Meteor.user().username);
  },
  'click #newProj':function(event){
    $('#newProjModal').modal('show');
  }

});