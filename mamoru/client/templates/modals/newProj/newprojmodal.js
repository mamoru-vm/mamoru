Template.newProjModal.onRendered(function(){

  $('#newProjModal').modal({
    onShow:function(){
    
    },
    onHide: function(){
     
    },
    onApprove : function() {
      var newProjName = $('#newProjName').val();
      Meteor.call('addProject', newProjName, function (error, result) {
        if(result){
          console.log(FlowRouter.current().path)
          if(FlowRouter.current().path !== '/admin/edit-projects'){
            var projSlug = Mamoru.Collections.Projects.findOne(result).slug
            FlowRouter.go(`/projects/${projSlug}/discover`);
          }
        } else {
          console.log(error)
        }
      });
    }
    });

});




Template.newProjModal.events({
  'keypress #newProjModal': function (event) {
    event.preventDefault();
    console.log("input event");
    // ...
  }
});
