Template.registerHelper("titleize", (string)=> {
    return s.titleize(string);
});


Template.registerHelper('parentData',
    function () {
        return Template.parentData(1);
    }
);

Template.registerHelper('isReady',
    function (sub) {
    if(sub) {
      return FlowRouter.subsReady(sub);
    } else {
      return FlowRouter.subsReady();
    }
    }
);

Template.registerHelper('myUsername',
    function () {
    if(Meteor.userId()) {
      return Meteor.user().username
    } else {
      return ""
    }
    }
);

Template.registerHelper('prettyDate',
    function (dateUTC) {
      return moment(dateUTC).format("dddd, MMMM Do YYYY, h:mm:ss a");
    }
);

Template.registerHelper('isUserAdmin',
  function(userId){
       return Roles.userIsInRole(userId, 'admin');
  }
);

Template.registerHelper('thisProject',
  function(){
    var currentProj = Session.get('currentProject');
    return Mamoru.Collections.Projects.findOne({slug:currentProj});
  }
);