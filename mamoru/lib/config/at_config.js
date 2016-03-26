AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/login',
    template: 'fullPageAtForm',
    layoutTemplate: 'loginLayout',
    layoutRegions: {},
    contentRegion: 'main'
});


function logoutHook(){
  FlowRouter.go("/login")
};


AccountsTemplates.configure({
    forbidClientAccountCreation: true,
    homeRoutePath: '/feed',
    onLogoutHook: logoutHook
});

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 4,
  },
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  pwd
]);

