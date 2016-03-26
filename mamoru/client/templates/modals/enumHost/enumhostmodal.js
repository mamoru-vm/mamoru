
Template.enumerateHostModal.onRendered(function(){

  $('#runEnum').click(function() {
    $('#enumForm').form('submit');
  });

$('#aggDropdown').dropdown();

  $('#enumerateHostModal').modal({
    onApprove : function() {
      console.log("enumerate Host!");
    },
    onShow:function(){
       $('#enumForm').form('reset');
       if(Session.get('selectedHost')){
          $('#enumForm').form('set value', 'hostaddress', Mamoru.Collections.Hosts.findOne(Session.get('selectedHost')).address );
       }
    }
  });

  
  $('#enumForm').on("submit", (e)=>{e.preventDefault()});

  $('#enumForm').form({
    inline:true,
    on:blur,
    fields:
    {
      hostAddress:{
        identifier:'hostaddress'
      },
      aggressionLevel:{
        identifier:'aggressionlevel'
      },
      ports:{
        identifier:"ports",
      },
      confirm:{
        identifier:'confirm',
        rules:[
          {
            type : 'checked',
            prompt : 'Must comfirm before running'
          }
        ]
      }
    },
    onSuccess:function(event,fields){
      console.log(fields)
      if(!fields.aggressionlevel){
        fields.aggressionlevel = 3
      }

      // run methods for enumeration
      Mamoru.Utils.enumHost(fields.hostaddress,fields.aggressionlevel,fields.ports);
      
      $('#enumerateHostModal').modal('toggle');
    }
  });

});

Template.enumerateHostModal.helpers({
  selectedHost: function () {
    if(Session.get('selectedHost')){
      return Mamoru.Collections.Hosts.findOne().address
    } else {
      return ""
    }
  }
});