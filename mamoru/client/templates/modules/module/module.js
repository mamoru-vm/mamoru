Template.aModule.onCreated(function(){
  var self = this;
  var modId = FlowRouter.getParam('moduleId');
  self.selectedPayload = new ReactiveVar()
  self.payloadOpts = new ReactiveVar([]);
  self.requiredOnly = new ReactiveVar( true )

  self.subscribe('api-jobs');
  
  self.subscribe('module', modId , {
    onReady: function(){
      console.log("module sub ready!")
      var mod = Mamoru.Collections.Modules.findOne(modId);
      if(mod.cat == 'exploit'){
        //var aPayload = Mamoru.Collections.Modules.find().fetch()[1]._id;
        self.selectedPayload.set("")
      }
    }
  });

  self.subscribe('module-options', FlowRouter.getParam('moduleId'),
    {
    onReady:function(){
        console.log("module options ready!");
        var thisMod = Mamoru.Collections.Modules.findOne(FlowRouter.getParam('moduleId'));
        var reqOptsCount = Mamoru.Collections.ModuleOptions.find({required: true}).count();
        // wait for render
        Tracker.afterFlush(function () {
          $('.ui.heart.rating')
          .rating({
            maxRating: 1,
            clearable: true
          });

          initForm('ModuleOptions');
          console.log("form initalized!");
          
          if(!reqOptsCount){
            sAlert.info(`${thisMod.name} has no required options!`);
            $('#allOpts').click();
          }
        });
        // doesnt need render, but all subs should be ready by now..
        if(thisMod.cat == 'exploit') {
           sAlert.info(`${thisMod.name} is an exploit must configure a payload`);
        }

      }
  }
  );





});

Template.aModule.events({
  'click .ui.huge.heart.rating':(event,template)=>{
    var toggled = $(event.target).parent('.ui.heart.rating').rating("get rating");
    var modId = FlowRouter.getParam('moduleId')
    if(toggled){
        console.log("favourited " + modId );
        Meteor.users.update({_id:Meteor.userId()},{$push:{'profile.faveMods': modId}});
    } else {
        console.log("un favourited " + modId);
        Meteor.users.update({_id:Meteor.userId()},{$pull:{'profile.faveMods': modId}});
      }
  }
});

chunkArray = function (array,chunkSize){
  var fields = []
    var i,j,chunk = chunkSize;
    for (i=0,j=array.length; i<j; i+=chunk) {
      fields.push(array.slice(i,i+chunk));
    }
  return fields
}

Template.aModule.helpers({
  checkFave: function(modId){
   if(Meteor.user().profile.faveMods){
    if(Meteor.user().profile.faveMods.indexOf(modId) > 0){
      console.log("you have faved this mod")
      return 1
    } else {
      console.log("not a fave")
      return 0
    }
   }
  },
  thisModule: function () {
    var modId = FlowRouter.getParam('moduleId')
    return Mamoru.Collections.Modules.findOne(modId);
  },
  truncPayloads: function(payloadsArray){
    if(payloadsArray.length > 10){
      var trunced = payloadsArray.slice(0,10);
      trunced.push("and more...")
      return trunced;
    } else {
      return payloadsArray;
    }
  },
  makeArray: function(obj){
    let valArray = [];
    for(let k in obj){
      valArray.push(obj[k]);
    };
    return valArray;
  },
  shortenName: function(string){
    string = string.split("_").join("::")
    return s.truncate(string,10);
  },
  enumOpts: function(){
    var optionArr = Mamoru.Collections.ModuleOptions.find({type:"enum"},{sort: {required: -1}}).fetch();
    //if(Template.instance().get('requiredOnly').get()){
      // optionArr = Mamoru.Collections.ModuleOptions.find({required:true, type:"enum"}, {sort: {required: -1}}).fetch();
  //  } else {
   // }
    return chunkArray(optionArr, 3)
  },
  textOpts: function(){
   var optionArr = Mamoru.Collections.ModuleOptions.find({type:{$in: ["address", "string", "addressrange"]},name:{$nin:["WORKSPACE"]}},{sort: {type: -1}}).fetch();
//  if(Template.instance().get('requiredOnly').get()){
   //   optionArr = Mamoru.Collections.ModuleOptions.find({$and:[{required:true},{type:{$in: ["address", "string"]}}]}, {sort: {type: -1}}).fetch();
  //  } else {
  //  }
    return chunkArray(optionArr, 3)
  },
  intOpts: function(){
   var optionArr = Mamoru.Collections.ModuleOptions.find({type:{$in: ["integer", "port"]}},{sort: {type: -1}}).fetch();
 // if(Template.instance().get('requiredOnly').get()){
 //     optionArr = Mamoru.Collections.ModuleOptions.find({$and:[{required:true},{type:"integer"}]},{sort: {type: -1}}).fetch();
 //   } else {
 //   }

    return chunkArray(optionArr, 2)
  },
  boolOpts: function(){
    var optionArr = Mamoru.Collections.ModuleOptions.find({type:"bool"}, {sort: {required: -1}}).fetch();
    //  if(Template.instance().get('requiredOnly').get()){
   //   optionArr = Mamoru.Collections.ModuleOptions.find({required:true, type:"bool"}, {sort: {required: -1}}).fetch();
  //  } else {
  //  }
  return chunkArray(optionArr, 3)
  },
  typeInt: function(type){
    return (type == "integer") ? true : false;
  },
  originalName: function(namewithunderscore){
    return namewithunderscore.split("_").join("::")
  },
  payloads: function(){
    var modId = FlowRouter.getParam('moduleId');
    return Mamoru.Collections.Modules.find({_id:{$ne:modId}}).fetch()
  }
});


createSemanticFieldsObj = function (collection){
  var options = Mamoru.Collections[collection].find().fetch();
  var fieldsObj = {}
  // these rules are kindof annoying, only really workout for required opts i think..
  options.forEach((opt)=>{
    fieldsObj[opt.name] = {identifier: opt.name, rules:[]}
    if(opt.required && !opt.default){
     /// fieldsObj[opt.name].rules.push({type:"empty"})
    }

    if(opt.type == "address"){
      //fieldsObj[opt.name].rules.push({type:"regExp[/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/]"})
    } else if(opt.type == "port"){
      //fieldsObj[opt.name].rules.push({type:"integer"})
    }
  });
  console.log(fieldsObj);
  return fieldsObj;
}


function sanitizeFields(fields){
  for(var k in fields){
    if(typeof(fields[k]) == 'string'){  // if a field is empty, dont pass it to the method
      if(fields[k].length == 0){
        delete fields[k]
      }  else if(fields[k] == 'on'){
        fields[k] = true;
      } else if(!isNaN(fields[k])){
        fields[k] = parseInt(fields[k]);
      }
    } else if(fields[k] == undefined){
      delete fields[k]
    } 

    if(k.split("_").length > 1 && fields[k] != undefined){  // change fields backinto native msf format with ::, might be able to avoid this...
      fields[k.replace("_", "::")] = fields[k]
      delete fields[k]
    }
  }
  // return santitized fields object to send to msf
  return fields
}


function watchJob(jobId){
  Meteor.call("jobInfo", jobId, (err,res)=>{
    if(!err){
      console.log(res);
    } else {
      console.log(err);
    }
  })
}

function initForm(collection){
    $("#modOptionsForm").form({
      on:'submit',
      inline:true,
      fields:createSemanticFieldsObj(collection),
      onInvalid: function(){},
      onValid: function(){},
      onSuccess: function(event,fields){
        var payloadErr = false;
        var mod = Mamoru.Collections.Modules.findOne(FlowRouter.getParam('moduleId'));
        if(mod.cat =="exploit"){
          var selectedPayloadId = Template.instance().get("selectedPayload").get();
          var payload = Mamoru.Collections.Modules.findOne(selectedPayloadId);
          if(payload){
            //set payload
            fields.PAYLOAD = payload.path;
            var payloadOpts = Template.instance().get("payloadOpts").get();
            if(payloadOpts.length != 0){
              // set payload options
              for(var i=0; i<payloadOpts.length; i++){
                 if(payloadOpts[i].name == "RHOST"){ 
                   delete payloadOpts[i].name
                 } else {
                   fields[payloadOpts[i].name] = payloadOpts[i].val
                 }
              }
            } else {
              sAlert.warning(`Must set payload options!`);
              payloadErr = true;
            }
          } else {
           sAlert.warning(`Must select a payload!`);
           payloadErr = true;
          }
        };
      if(!payloadErr){
       var sanitizedOpts =  sanitizeFields(fields);
       // add current workspace as option
       sanitizedOpts.WORKSPACE = Session.get("currentProject");
       console.log("Options passed to runModule method: ");
       console.log(sanitizedOpts);
       Meteor.call("runModule", mod._id, sanitizedOpts, (err,res)=>{
        if(!err){
            if(res.uuid){
              console.log(res);
              if(mod.cat == 'exploit'){
                var infoMsg = sAlert.info(`Running ${mod.name} exploit against ${fields.RHOST}...`, {timeout: 'none',onRouteClose: false});
                Tracker.autorun((c)=>{
                  var thisJob = Mamoru.Collections.ApiJobs.findOne(res.mamoru_job_id);
                  if(thisJob.status == 'completed'){
                    sAlert.close(infoMsg);
                    sAlert.success(`Session opened to ${fields.RHOST}!!`);
                    $("#modOptionsForm").form('reset');
                    c.stop();
                  } else if(thisJob.status == 'failed') {
                    sAlert.close(infoMsg);
                    sAlert.warning(`bah no session try different options?`);
                    $("#modOptionsForm").form('reset');
                    c.stop();
                  }
                });
              } else {
                sAlert.info(`Running ${mod.name}...`);
              }
            } else {
               console.log("something went wrong running the module");
               sAlert.error("Err, wrong params?");
            }
          } else {
            console.log("something went wrong with running the module");
            sAlert.error(err);
            $(".ui.form").form('clear');  
          }
        });
      }
      },
      onFailure: function(errors,fields){
        console.log(errors);
        console.log(fields);
        sAlert.error('missing required options :(')
      }
  });
  $(".help.circle.icon.pop").popup({inline: true, movePopup:false, jitter:60});
  $(".label.pop").popup({inline: true,movePopup:false, jitter:60});
  $('.ui.toggle.checkbox').checkbox();
  $('.dropdownOpt').dropdown();
}


 function alertContainers(){
  Meteor.setTimeout(function(){
    Mamoru.Collections.Containers.find().forEach((container)=>{
      if(!container.up){
        sAlert.info(`${container.name} for ${container.plugin} is not running! - an Admin needs to create and start it!`, {timeout: 'none', onRouteClose: false});
      }
    })
  }, 1500)
}

Template.aModule.onRendered(function(){




// wait till form sub 
alertContainers()
});