Template.nmapModal.onRendered(function(){

  $('#runNmap').click(function() {
    console.log("clicked run nmap")
    $('#nmapForm').form('submit');
  });

$('#aggDropdown').dropdown();

  $('#nmapModal').modal({
    onApprove : function() {
      console.log("enumerate Host!");
    },
    onShow:function(){
      console.log("nmap model show!")
       $('#nmapForm').form('reset');



  $('#nmapForm').form({
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
      
      $('#nmapModal').modal('toggle');
    }
  });
    }
  });

  
  //$('#nmapForm').on("submit", (e)=>{e.preventDefault()});



});