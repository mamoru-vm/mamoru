Template.newHostModal.onRendered(function(){
  $('.ui.dropdown').dropdown()

  $('#newHostForm').on("submit", (e)=>{e.preventDefault()});

  $('#newHostModal').modal({
     onShow:function(){
    
      },
    onHide: function(){
     
    },
    onApprove : function() {
      console.log("addHost!");
    }
  });

  $('#saveHost').click(function() {
    $('#newHostForm').form('submit');
  });

   $('#newHostForm').form({
    inline:true,
     on:'blur',
     fields:{
      address:{
        identifier:'address',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter an {identifier}'
          }
        ]
      },
      name:{
        identifier:'name',
        rules: [ ]
      },
      os_name:{
        identifier:'os_name',
        rules: [ ]
      },
      purpose:{
        identifier:'purpose',
        rules: []
      },
      os_flavor:{
        identifier:'os_flavor',
        rules: [ ]
      },
      state:{
        identifier:'state',
        rules:[
         {
          type   : 'empty',
          prompt : 'Please select a {identifier}'
          }
        ]
      }
    },
    onSuccess:function(event,fields){
      fields.addToMSF = true;
      fields.projectId = Mamoru.Collections.Projects.findOne({slug:Session.get('currentProject')})._id;
      console.log(fields)
      Meteor.call('addHost', fields, (err,res)=>{
        if(err){
          console.log(err)
        } else {
           $('#newHostModal').modal('toggle');
           sAlert.success("Added Host: " + fields.address);
        }
      });
        
    }


   });


});
