Meteor.methods({

  'fixtures/reset': function (removeUsers) {
    var resetUsers = removeUsers || false
     if (resetUsers) {
        Meteor.users.remove({});
      }

    //Meteor.users.remove({});
    //Mamoru.Collections.Modules.remove({});
    if(Mamoru.Collections.Projects.find({}).count() > 1){
      Mamoru.Collections.Projects.remove({});
      Mamoru.Collections.Projects.insert({name:"default"});
    }
    
   // Mamoru.Collections.Hosts.remove({});
   // Mamoru.Collections.Services.remove({});
   // Mamoru.Collections.Notes.remove({});
    //Mamoru.Collections.Events.remove({});
  },

  'fixtures/seedData': function () {

    
  },

  'fixtures/seedUsers': function () {
        var testUsers = [{
        name: "admin",
        email: "admin@msfcli.net",
        roles: ["admin"]
    }, {
        name: "user",
        email: "user@msfcli.com",
        roles: ["user"]
    }];

   // add test users
   testUsers.forEach((testUser)=> {
        //test if user already exists
        if (!Accounts.findUserByEmail(testUser.email)){
            console.log("creating user "+ testUser.name);
            const devPass = "pass!"
            var newUserId = Accounts.createUser({
                email: testUser.email,
                password: devPass,
                profile: {roles:testUser.roles}
            });

            Accounts.setUsername(newUserId, testUser.name);
            // add user to roles
            Roles.addUsersToRoles(newUserId, testUser.roles);
            console.log("Created test user: " + testUser.name);
        };
    });
  },

  'test/UsersExist': function () {
    return Meteor.users.findOne()
  }


});