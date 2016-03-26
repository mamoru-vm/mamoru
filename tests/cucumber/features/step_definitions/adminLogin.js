module.exports = function(){

  this.Then(/^Have access to admin functionality$/, function () {
  // Write the automation code here
    browser.waitForExist('#newProj');
    browser.click('#projectsNav');
    expect(browser.getText('#newProj')).toEqual('New Project');
  });    

};
