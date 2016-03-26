module.exports = function () {
  
  this.Before(function () {
     //this is to ensure Meteor object is available and loaded, otherwise Meteor.logout() will fail
      server.call('fixtures/reset');
      server.call('fixtures/seedData');

      browser.url(process.env.ROOT_URL);
      this.AuthHelper.logout();
       
      });
  };

  
