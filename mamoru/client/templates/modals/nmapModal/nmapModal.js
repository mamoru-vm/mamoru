Template.nmapModal.onRendered(function(){


$('.aggDropdown').dropdown();

    $('#nmapOptForm').form({
    inline:true,
    on:blur,
    fields:
    {
      addresses:{
        identifier:'addresses'
      },
      aggressionLevel:{
        identifier:'aggressionlevel'
      },
      ports:{
        identifier:"ports",
      },
      confirm:{
        identifier:'conf',
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
      Mamoru.Utils.runNmap(fields.addresses,fields.aggressionlevel,fields.ports);
      $('#nmapModal').modal('toggle');
    }
    });
  
  $('#nmapModal').modal({
    onApprove : function() {
      $('#nmapOptForm').form('submit');
      console.log("enumerate Host!");
    },
    onShow:function(){
      console.log("nmap model show!")
       $('#nmapOptForm').form('reset');

    }
  });

  $('#runNmap').click(function() {
    $('#nmapOptForm').form('submit');
  });

  //$('#nmapForm').on("submit", (e)=>{e.preventDefault()});



});