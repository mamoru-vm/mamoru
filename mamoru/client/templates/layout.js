Template.appLayout.onRendered(function(){


 //handle close of messages, not really using...
 $('.message .close').on('click', function() {
    $(this).closest('.message').transition('fade');
 });

});

Template.appLayout.onCreated(function(){
  var self = this;
  // just for alerts if containers do not exist, or need to be started
    self.subscribe('all-containers', {
          onReady:function(){
            var containers = Mamoru.Collections.Containers.find({}).fetch();
            for(var i=0; i<containers.length; i++){
              if(!containers[i].containerId){
                sAlert.error(`${containers[i].name} does not exist!`, {timeout:'none', onRouteClose: false});
              } else if(!containers[i].up){
                sAlert.warning(`${containers[i].name} is not running!`, {timeout:'none', onRouteClose: false} );
              } else if(!containers[i].initalized){
                console.log("container not initalized, running check to initalize....")
                console.log("Running check for: " + containers[i].name);
                Meteor.call("checkContainer", containers[i]._id);
              }
            }
          }
    });

})

Template.appLayout.events({


});

/*
Template.sAlertCustom.events({
  'click .closeAlert': function(event,template){
    console.log("close alert!!");
    sAlert.close(this._id);
  }
});

Template.sAlertCustom.onRendered(function(){
   $('.ui.fixed.bottom.sticky').sticky('refresh');
})
*/
