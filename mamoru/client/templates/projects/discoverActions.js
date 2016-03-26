// discoverActions
Template.discoverActions.helpers({
  Files:function(){
   return Template.instance().Files.get()
  },
  scanMods: function(){
    return Mamoru.Collections.Modules.find();
  },
  isHostSelected:function(){
    if(Session.get('selectedHost')){
      return true
    } else {
      return false
    }
  },
  selectedHost:function(){
    let hostId = Session.get('selectedHost')
    return Mamoru.Collections.Hosts.findOne(hostId);
  }
});

Template.discoverActions.onCreated(function(){
 this.Files = new ReactiveVar([])
});

Template.discoverActions.events({
  'click .selectFiles': function (event) {
      event.preventDefault();
      $('.fileInput').click();
  },
  'click .scanMod':function(event){
   let modId = $(event.currentTarget).data('value');
   FlowRouter.go(`/modules/${modId}`);
  },

  'click .uploadFiles':function(event, template){
    var project = Mamoru.Collections.Projects.findOne({slug:Session.get('currentProject')})
    var files = template.Files.get();
    //console.log(files);

    for(let i=0;i<files.length;i++){
      var reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = function (e) {
        var fileName = files[i].name;
        var fileType = files[i].type;
        console.log(fileType, fileName);
        var fileContents = e.target.result.split(",")[1]
        Meteor.call('insertScanFileText', fileContents, project.name, function(err,res){
          if(!err){
            sAlert.success(`Inserted Scan Data from: ${s.truncate(fileName,16)}`);
            files.remove(i);
           } else {
            sAlert.error(`${err} of ${s.truncate(fileName,16)}`);
          }
        });
      } 
    }
     template.Files.set([]);
  },

  'change .fileInput':function(event, template){
    var selectedFiles = template.Files.get()
     _.each(event.currentTarget.files, (f)=>{
        selectedFiles.push(f);
     });
     template.Files.set(selectedFiles);
  },

  'click .fileRemove': function (event, template) {
    var fileIndex = $(event.currentTarget).parent().data('value');
    var files = template.Files.get();
    console.log(fileIndex);
    console.log(files);
    files.remove(fileIndex);

    template.Files.set(files);  
  },

  'click .addHost': function(event){
    console.log("add host button!!")
    $('#newHostModal').modal('toggle');
  },
  'click .enumerateHost':function(event, target){
    $('#enumerateHostModal').modal('toggle');
  }
});


Template.discoverActions.onRendered(function(){
 $('.ui.label').popup({on:'hover',variation:'tiny basic very wide'})

 $(".discoverDropdown").dropdown({action: 'hide'});

});


/*
Template.discoverHostActions.helpers({
  
});

Template.discoverHostActions.events({
  'click #enumerateHost':function(event, target){
    $('#enumerateHostModal').modal('toggle');
  },
  'dblclick #selectedHostHeader':function(event){
    Session.set('selectedHost', null);
    Session.set('selectedService', null);
  },
  'click #deleteHost':function(event){
    let selectedHostId = Session.get('selectedHost');
    Meteor.call('delHost', selectedHostId, function (error, result) {
      if(!error){
        sAlert.success('Removed Host!');
      }
    });
  }
});

Template.discoverHostActions.onRendered(function(){
   $("#hostDropdown").dropdown({action: 'hide'});
});

*/