Template.aHost.helpers({
  thisHost: function () {
    var hostId = FlowRouter.getParam('hostId');
    return Mamoru.Collections.Hosts.findOne(hostId);
  }
});

Template.aHost.events({
  'click': function () {
    // ...
  }
});

Template.aHost.onRendered(function(){

});