// globally ensure sign in
FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn]);

// check admin redirect trigger
function checkAdminTrigger(context, redirect){
  if(!Roles.userIsInRole(Meteor.userId(), 'admin')){
    if(context.oldRoute){
      redirect(context.oldRoute.path);
    }
  };
};


// 404 route
FlowRouter.notFound = {
    action: function(params, queryParams) {
      if(!Meteor.userId()){
         FlowRouter.go("/login")
      } else {
        BlazeLayout.render('routeNotFound');
      }
    }
};

////////////////////////////////////////////////////////////////////////////
//root / routes
FlowRouter.route('/feed', {
    action: function(params, queryParams) {
      BlazeLayout.render('appLayout', { nav: "Navbar", main: "activityFeed"});
    },
    subscriptions: function(params, queryParams) {
      //this.register('allMods', Meteor.subscribe('all-modules'));
    }
});

FlowRouter.route('/profile/:userName', {
    action: function(params, queryParams) {
      BlazeLayout.render('appLayout', { nav: "Navbar", main: "userProfile"});

    },
    subscriptions: function(params, queryParams) {
      this.register('aProfile', Meteor.subscribe('userProfile', params.userName));
    }
});


FlowRouter.route('/', {
    action: function(params, queryParams) {
      FlowRouter.go("/feed")
    }
});


/////////////////////////////////////////////////////////////////////////////
// group all /module routes
var moduleRoutes = FlowRouter.group({
  prefix: '/modules',
  name: 'modules',
  triggersEnter: [function(context, redirect) {
    console.log(context);
    console.log('entering module route');
  }]
});


moduleRoutes.route('/', {
  action: function(params) {
    BlazeLayout.render('appLayout', { nav: "Navbar", main: "moduleList"});
  },
  triggersEnter: [function(context, redirect) {
    console.log('running /modules trigger');
  }]
});



/*
moduleRoutes.route('/filtered', {
  action: function(params) {
    console.log(params.modType);
    BlazeLayout.render('appLayout', { nav: "Navbar", main: "moduleList"});
  },
  subscriptions: function(params, queryParams) {
        if (queryParams.platform) {
          this.register('allMods', Meteor.subscribe('filtered-modules', queryParams.category, queryParams.platform));
        } else {
          this.register('allMods', Meteor.subscribe('filtered-modules', queryParams.category));
        }
   },
  triggersEnter: [function(context, redirect) {
    console.log(context);
    console.log('running mod type trigger');
  }]
});
*/

moduleRoutes.route('/:moduleId', {
  action: function(params) {
    BlazeLayout.render('appLayout', { nav: "Navbar", main: "aModule"});
  },
  triggersEnter: [function(context, redirect) {
    console.log(context);
    console.log('running mod type trigger');
  }]
});


///////////////////////////////////////////////////////////////////////////////////


// group all project routes
var projectRoutes = FlowRouter.group({
  prefix: '/projects',
  name: 'projects',
  triggersEnter: [function(context, redirect) {
    Session.set('selectedHost', null);
    //console.log(context);
    //console.log('entering projects route');
  }],
  subscriptions: function(params, queryParams) {
    this.register('allJobs', Meteor.subscribe('all-jobs'));
    }
});

/*
projectRoutes.route('/', {
  action: function() {
    BlazeLayout.render('appLayout', { nav: "Navbar", main: "projectMain"});
  },
  triggersEnter: [function(context, redirect) {
    console.log('running /modules trigger');
  }],
  subscriptions: function(params, queryParams) {
      this.register('allMods', Meteor.subscribe('all-modules'));
  }
});
*/

function isAction(projectAction){
  let projectActions = ['discover', 'exploit', 'report'];
  if (projectActions.indexOf(projectAction) != -1){
    return true
  } else {
    return false
  }
}

projectRoutes.route('/:projectSlug/:projectAction', {
  action: function(params) {
    if(Session.get('currentProject') === params.projectSlug){
         BlazeLayout.render('appLayout', { nav: "Navbar", projNav:"projectNav", main: params.projectAction});
       } else {
        BlazeLayout.render('appLayout', { nav: "Navbar", projNav:"projectNav", main: params.projectAction});
        Session.setPersistent('currentProject', params.projectSlug);     
        Meteor.call('setProject',params.projectSlug, function(err,res){
          if(err){
            console.log(err)
          } else {
            console.log(res)
          }
        });
      }
  
  },
  triggersEnter: [function(context, redirect) {
    //console.log(context);
    //console.log('running project trigger enter');
  }]
});

/////////////////////////////////////////////////////////////////////////////////////

// group all admin routes
var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [checkAdminTrigger]
});

adminRoutes.route('/edit-users', {
  action: function(params) {
    console.log(params.projectId);
    BlazeLayout.render('appLayout', { nav: "Navbar", main: "editUsers"});
  },
  subscriptions: function(params, queryParams) {
      this.register('allUsers', Meteor.subscribe('all-users'));
  }
});


adminRoutes.route('/edit-projects', {
  action: function(params) {
    BlazeLayout.render('appLayout', { nav: "Navbar", main: "adminProjects"});
  },
  subscriptions: function(params, queryParams) {
    this.register('allUsers', Meteor.subscribe('all-users'));
  }
});


adminRoutes.route('/containers', {
  action: function(params) {
    BlazeLayout.render('appLayout', { nav: "Navbar", main: "manageContainers"});
  },
  subscriptions: function(params, queryParams) {
  }
});


