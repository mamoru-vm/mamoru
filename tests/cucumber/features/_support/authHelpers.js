module.exports = function () {
  this.Before(function () {
     var url = require('url');

    this.AuthHelper = {
     
      logout: function () {
        browser.executeAsync(function (done) {
          Meteor.logout(done);
        });
      },
      login: function(username,password){
        browser.url(url.resolve(process.env.ROOT_URL, 'login'));
        browser.waitForExist('#at-btn');
        browser.setValue('#at-field-username_and_email', username);
        browser.setValue('#at-field-password', password);
        browser.click('#at-btn');
      }
    
    };

  });
};