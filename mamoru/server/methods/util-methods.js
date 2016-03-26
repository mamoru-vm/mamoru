
Meteor.methods({

  //full text search implementation
  searchModules: function(query){
    var categoryResponse = {exploit:{name:"Exploit",results:[]},post:{name:"Post",results:[]},auxiliary:{name:"Auxiliary",results:[]},encoder:{name:"Encoder",results:[]},payload:{name:"Payload",results:[]}, nop:{name:"Nop",results:[]}};
    var searchRes = Modules.find({$text:{$search:query}}, {fields:{score: { $meta: "textScore" }}, sort:{score: {$meta:"textScore"}}, limit:7 }).forEach(function (mod) {
      if(mod){
        categoryResponse[mod.cat].results.push({title:mod.name,price:mod.rank,description:mod.description})
      }
    });;
   return categoryResponse
  },
  
  // for admins to add new users from client
  addNewUser: function(userName,userEmail,userPass,userRole){
    if(Meteor.userId() && Roles.userIsInRole(Meteor.userId(),'admin')) {
      var newUserId = Accounts.createUser({
                                          email: userEmail,
                                          password:userPass,
                                          profile:{roles:userRole}
                                          });
       
       Accounts.setUsername(newUserId, userName);
       
       Roles.addUsersToRoles(newUserId, userRole);
       return `${userName} created!`
    } else {
       throw new Meteor.Error("not-allowed", "Not for you!");
    }
  },
  
  //used to notify all clients a host is being enumerated
  toggleHostEnumeration: function(hostId, enumeratingState){
     return Mamoru.Collections.Hosts.direct.update(hostId, {$set:{enumerating:enumeratingState}});
  }

  
});