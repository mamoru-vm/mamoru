Template.moduleActions.events({
  'click .payLoadOpts': function (event, template) {
   
    $( "#exploitPayloadModal" ).modal('show');

  },
  'click #allOpts': function (event, template) {
    template.parent(1).requiredOnly.set(false)
    $( ".notRequiredField" ).show();

  },
  'click #requiredOpts': function(event, template){
    template.parent(1).requiredOnly.set(true)
    $( ".notRequiredField" ).hide();
  },
  'click #setDefaults': function(event,template){
   template.parent(1).requiredOnly.set(false)
   $( ".notRequiredField" ).show();
   Mamoru.Collections.ModuleOptions.find({$and:[{default:{$ne: null}},{default:{$ne: ""}}]}).forEach((opt)=>{
      $("#modOptionsForm").form("set value", opt.name ,opt.default);
   });
  },
  'click #clearOpts': function(event, template){
    $("#modOptionsForm").form("clear");
  },
  'click #advancedOpts': function(event, template){
    console.log("advancedOpts!");
  },
  'click #runModule': function(event, template){
    // submit form which on successful validation will run the runModule meteor method.
    $("#modOptionsForm").form("submit");
  }
});


Template.moduleActions.helpers({
requiredOnly: function(){
    return Template.instance().parent(1).requiredOnly.get()
  },
anExploit: function(){
  var thisMod = Mamoru.Collections.Modules.findOne(FlowRouter.getParam('moduleId'));
  if(thisMod){
    if(thisMod.cat == "exploit"){
      return true
    } else {
      return false
    }
  } else {
    return false;
  }
  },
  onMobile: function(orientation){
    if(orientation == 'horizontal'){
      return true
    } else {
      return false
    }
  }
});