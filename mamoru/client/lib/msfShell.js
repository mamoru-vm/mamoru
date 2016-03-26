// bit of a hack, to print to josh shell
printToShell = function(str){
    msfShell.deactivate();
    var templ =  _.template('<div><strong><%=str%></strong></div>');
    $('#msfShell-input .input .cursor').css('textDecoration', '');
    $('#msfShell-input').removeAttr('id');
    $('#msfShell-view').append(templ({str: str}));
    msfShell.activate()
}

initShell = (exploitTemplate)=>{

var history = Josh.History({key:'msfShell.history'});
var killring = new Josh.KillRing();
var readline = new Josh.ReadLine({history: history, killring: killring });
var newShellConfig = {readline: readline,
                      history: history,
                      shell_view_id: "msfShell-view",
                      shell_panel_id: "msfShell-panel",
                      prompt: "msfcli >",
                      input_id: "msfShell-input",
                      console: console,
                      };
    
msfShell = new Josh.Shell(newShellConfig);



console.log("Created: msfShell");

  // Setup the `Underscore` template for displaying items in the `KillRing`.
var basicTemplate =  _.template('<div><strong><%=message%></strong></div>');
var killringItemTemplate = _.template('<div><% _.each(items, function(item, i) { %><div><%- i %>&nbsp;<%- item %></div><% }); %></div>');
var moduleTemplate = _.template('<div style="text-indent: .5em;"><% _.each(items, function(item, i) { %><div><%- i %>&nbsp;<%- item %></div><% }); %></div>');
var versionItemTemplate = _.template('<div><div><b>MSF Version:</b>&nbsp;<%- version %></div></div><div><div><b>Ruby:</b>&nbsp;<%- ruby %></div></div>');
var consoleCreateTemplate = _.template('<div><div><b>ID:</b>&nbsp;<%- id %></div></div><div><div><b>Busy:</b>&nbsp;<%- busy %></div></div>');
var listTemplate = _.template('<div style="text-indent: .5em;"><% _.each(items, function(item, i) { %><div><%- item %></div><% }); %></div>');


  // Create a the command `killring` which will display all text currently in the `KillRing`, by attaching
  // a handler to the `Shell`.

msfShell.setCommandHandler("killring", {
  // We don't implement any completion for the `killring` command, so we only provide an `exec` handler, and no `completion` handler.
  exec: function(cmd, args, callback) {

    // `killring` takes one optional argument **-c** which clears the killring (just like **history -c**).
    if(args[0] == "-c") {
      killring.clear();

      // The callback of an `exec` handler expects the html to display as result of executing the command. Clearing the
      // killing has no output, so we just call the callback and exit the handler.
      callback();
      return;
    }

    // Return the output of feeding all items from the killring into our template.
    callback(killringItemTemplate({items: killring.items()}));
  }
});



/*
msfShell.setCommandHandler("show", {
    exec: function(cmd, args, callback) {
        var arg = args[0] || '';
        var res = Meteor.call('msfCommand', [arg], function(err,res){
          callback(moduleTemplate({items:res.modules}));
        });
    },
    completion: function(cmd, arg, line, callback) {
        callback(msfShell.bestMatch(arg, ['module.exploits', 'module.post', 'module.auxiliary', 'module.encoders','module.nops']));
    }
});
*/

msfShell.setCommandHandler("version", {
    exec: function(cmd, args, callback) {



     
       Meteor.call('msfCommand', ['core.version'], function(err,res){
          if (err) {
            console.log(err);
            callback(err.error_message);
          } else { 
            console.log(res);
            callback(versionItemTemplate({version:res.version, ruby:res.ruby}));
          }
        });

  
    },
    completion: function(cmd, arg, line, callback) {
        callback(msfShell.bestMatch(arg, ['module.exploits', 'core.version']));
    }
});

// overwrite default handler, ? could be a better way...
msfShell.setCommandHandler("_default", {
    exec: function(cmd, args, callback) {
      var sessionType = exploitTemplate.sessionType.get();
      var sessionId = exploitTemplate.interactingWith.get(); 
      if(sessionType == 'shell'){     
        if(cmd != "start_meterpreter"){
          var argStr = args.join(" ");
          Meteor.call('writeSession', `${cmd} ${argStr}`, {sessionId: sessionId, type: sessionType }, function(errW,resW){
            if(!errW){
               Meteor.call('readSession', sessionId,  sessionType, function(errR,resR){
                  if(!errR){
                    console.log(resR);
                    var resMsg = splitOnEnter(resR.data)
                    console.log(resMsg);
                    callback(basicTemplate({message:resMsg}))
                  } else {
                    var errMessage = "whoops, didnt work..."
                    callback(basicTemplate({message:errMessage}));
                  }
               })
            } else {
              var errMessage = "whoops, didnt work..."
              callback(basicTemplate({message:errMessage}));
            }
          });
        } else if(cmd == "start_meterpreter"){
          var sessionId = exploitTemplate.interactingWith.get();
          console.log(sessionId);
           Meteor.call('upgradeShell', sessionId, 4447, function(err,res){
              if(!err){
                  Meteor.setTimeout(()=>{
                       Meteor.call('checkForSessions');
                  }, 4000);
                  callback(basicTemplate({message:res.result}));
              } else {
                  var errMessage = "whoops, didnt work..."
                  callback(basicTemplate({message:errMessage}));
              }
           })
        }
      } else {
         callback(basicTemplate({message:"do meterprter stuff"}));
      }
    },
    completion: function(cmd, arg, line, callback) {
        var sessionId = exploitTemplate.interactingWith.get();
        var sessionType = exploitTemplate.sessionType.get();
        var baseCmds = msfShell.commands();
        if(sessionType == 'shell'){
          baseCmds.push("start_meterpreter");

        } else {
          baseCmds.push("compatible_post");
        }

        callback(msfShell.bestMatch(cmd, baseCmds));

    }
});

function splitOnEnter(resStr){
  return resStr.replace(/\n\r?/g, '<br />')
}
}
/*
msfShell.setCommandHandler("use", {
    exec: function(cmd, args, callback) {
      var arg = args[0] || '';
        if(arg === ''){
          callback('<strong style="color:red">Must use something!</strong>');
        } else { 
            if(!Modules.findOne({path:arg})){
              callback('<strong style="color:red">Hrmm cannot find that module!</strong>');
            } else {
                callback('<strong>Found module ' + arg + '</strong>');
            }
          // must have consoles created, would like to send this straight to a console for a response...
          //this would change the prompt to match prompt response to console.write
          // callback will be console.read...
         
        
           Meteor.call('msfCommand', ['console.write', args[0]], function(err,res){
              if (err) {
                console.log(err)
                callback("whoops error")
              } else { 
                console.log(res)
                callback(versionItemTemplate({version:res.version, ruby:res.ruby}))
              }
            });
        
      
        }
  
    },
    completion: function(cmd, arg, line, callback) {

        var suggestions = Modules.find({},{fields:{path:1}}).map(function(mod){
            return mod.path
        });
        
        callback(msfShell.bestMatch(arg, suggestions));
    }
});
*/

/*
msfShell.setCommandHandler("console", {
  exec: function(cmd, args, callback) {
     var arg0 = args[0] || '';
     if (arg0 == 'create'){
     Meteor.call('msfCommand', ['console.create'], function(err,res){
        if (res.error_message) {
          console.log(err)
          callback(err.error_message);
        } else { 
          msfShell.setPrompt(res.prompt);
          Session.set("currentConsole", res.id)
          callback(consoleCreateTemplate({id:res.id, busy:res.busy}))
        }
      });
    } else if (arg0 == 'destroy'){
      var arg1 = args[1] || '';
       Meteor.call('msfCommand', ['console.destroy', arg1], function(err,res){
        if (err) {
          console.log(err)
          callback(err.error_message);
        } else { 
          console.log(res.result);
          msfShell.setPrompt('jsh$ ');
          Session.set("currentConsole", null)
          callback("Console " +arg1 + " destroyed")
        }
      });

    }

  },
  completion: function(cmd, arg, line, callback) {
      console.log(cmd)
      console.log(arg)
      callback(msfShell.bestMatch(arg, ['create', 'destroy']))
  }
});
*/



