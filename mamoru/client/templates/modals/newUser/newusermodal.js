Template.newUserModal.onRendered(function(){


  $('.ui.toggle.checkbox').checkbox();

  $('#saveUser').click(function() {
    $('#newUserForm').form('submit');
  });

  $('#newUserForm').on("submit", function (e) { e.preventDefault() 
      //$('#newUserForm').form('validate form');
  });

  $('#newUserForm').form({
    inline:true,
    on:'submit',
    fields:{
      username:{
        identifier:'username',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a {identifier}'
          }
        ]
      },
      email:{
        identifier:'email',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter an {identifier}'
          },
          {
            type   : 'email',
            prompt : 'Please enter a valid {identifier}'
          }
        ]
      },
      temppass:{
        identifier:'temppass',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a password'
          }
        ]
      },
      checkpass:{
        identifier:'checkpass',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please repeat your password'
          },
          {
            type   : 'match[temppass]',
            prompt : 'Please enter the same password'
          }
        ]
      },
      isadmin:{
        identifier:'isadmin'
      }
    },
    onSuccess:function(event,fields){
      console.log("form valid!");
      console.log("time to submit")
      var role = (fields.isadmin) ? ['admin'] : ['user'];
      Meteor.call('addNewUser', fields.username, fields.email, fields.temppass, role, function(err,res){
        if(res){
          console.log(res);
          $('#newUserModal').modal('hide');
        } else {
          console.log(err);
          $('#newUserModal').modal('hide');
        }
      });
    }
  });

  $('#newUserModal').modal({
    onShow:function(){
    
    },
    onHide: function(){
     
    },
    onApprove : function() {
      console.log("addUser!");
    }
    });

});

Template.newUserModal.events({
  'click #saveUser': function (event) {
    console.log('hi');
      $('#newUserForm').form('submit');
      //$('#newUserForm').form('validate form');
  }
});
