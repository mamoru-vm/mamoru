
/* not using can probably get rid of this ...
function checkPG(user,pass,ip, db){
    Msf.PGdb.init(user,pass,ip, db);

    Msf.PGdb.Host.findOne().then((host)=>{
    Mamoru.Status.pg = 'up';
    console.log("MSF DB is good!");
    Meteor.clearInterval(Mamoru.Intervals.checkPG);
    }).catch((err)=>{
        console.log(err);
        console.log("whoaa SQL down?");
        Mamoru.Status.pg = 'down';
        console.log(Mamoru.Status);
    });
}

function checkMsf(){
    try {
        var v = msfAPI.clientExec('core.version');
        Mamoru.Status.msf = 'up';
        console.log("MSF API is good!");
        Meteor.clearInterval(Mamoru.Intervals.checkMSF);
    } catch(err){
        console.log("whoops. API isnt working...");
        Mamoru.Status.msf = 'down';
    }
}

Meteor.methods({
  setConfig: (configObject)=>{
    if(Roles.userIsInRole(Meteor.userId(), 'admin') ) {
      console.log("set config data");
      console.log(configObject);
     

      if(Mamoru.Configs.msf != configObject.msf ){
        Mamoru.Configs.msf = configObject.msf 
         Mamoru.API.client = msfAPI.newClient({        
                          user: Mamoru.Configs.msf.USER,
                          password: Mamoru.Configs.msf.PASS,
                          host: Mamoru.Configs.msf.IP,
                          persist:true
                        });

      console.log("MSFAPI CLIENT SET!");
      Mamoru.Intervals.checkMSF = Meteor.setInterval(checkMsf,
                                              4000)
      }

      if(Mamoru.Configs.pg != configObject.pg){
         Mamoru.Configs.pg = configObject.pg
          Mamoru.Intervals.checkPG = Meteor.setInterval(checkPG(Mamoru.Configs.pg.USER,
                                                  Mamoru.Configs.pg.PASS,
                                                  Mamoru.Configs.pg.IP,
                                                  Mamoru.Configs.pg.DB),
                                         4000);

      }

      return 'OK'
    }

  }
});
*/