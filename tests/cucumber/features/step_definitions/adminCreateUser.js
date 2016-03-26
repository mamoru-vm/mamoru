module.exports = function(){

this.When(/^I enter the new user info for "([^"]*)"$/, function (username) {
   browser.setValue('#username', username);
   browser.setValue('#email', username +'@test.com');
   browser.setValue('#temppass', username);
   browser.setValue('#checkpass', username);
});


};