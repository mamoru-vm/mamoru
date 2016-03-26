  module.exports = function(){

    var url = require('url');

    this.Given(/^I am an existing user who is not logged in$/, function () {
        expect(server.call('test/UsersExist')).not.toBeNull();
    });

    this.Given(/^I navigate to "([^"]*)"$/, function (undefinedRoute) {
        browser.url(url.resolve(process.env.ROOT_URL, undefinedRoute));
    });

    this.Then(/^I will be redirected to "([^"]*)"$/, function (loginRoute) {
      browser.waitForExist('#at-btn');
      expect(browser.isVisible('#at-btn')).toBe(true);
    });


    this.When(/^I login with "([^"]*)" and password "([^"]*)"$/, function (Username, Password) {
        this.AuthHelper.login(Username, Password);
    });

    this.Then(/^I should be redirected to the "([^"]*)"$/, function (PageTitle) {
      browser.waitForExist('#pTitle');
      expect(browser.getText('#pTitle')).toEqual(PageTitle);
    });
    
};

