Accounts.onLogin(function(){
  //set current project to default if not previously visited different project
  if(!Session.get('currentProject')){
    Session.setPersistent('currentProject', 'default');
  }

});

Meteor.startup(function() { 

Tracker.autorun(function () {
  if(!Meteor.userId()){
    FlowRouter.go("/login");
  }
});

sAlert.config({
        effect: 'slide',
        position: 'bottom',
        timeout: 4000,
        html: false,
        onRouteClose: true,
        stack: {spacing: 10, limit: 3},
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
    });

});