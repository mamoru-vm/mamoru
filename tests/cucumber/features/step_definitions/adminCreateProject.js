module.exports = function(){
 
 var searchString = function (toSearch, string){
    return toSearch.indexOf(string) != -1;
  }

this.When(/^I enter the Project Name "([^"]*)"$/, function (newProjectName) {
  browser.setValue('#newProjName', newProjectName);
  browser.click('#saveProj');
});

this.Then(/^A new row "([^"]*)" should appear in the table row "([^"]*)"$/, function (newProjectName, rowClass) {
  
  var nameRows = browser.elements('.' + rowClass).value
  var rowValues = []
  nameRows.forEach(function(r){
    rowValues.push(browser.elementIdText(r.ELEMENT).value)
  });
  expect(searchString(rowValues,newProjectName)).toBe(true);
});


this.Then(/^The value "([^"]*)" should appear in the table row "([^"]*)"$/, function (rowValue, rowClass) {
  console.log(rowClass)
  var nameRows = browser.elements('.' + rowClass).value
  var rowValues = []
  nameRows.forEach(function(r){
    rowValues.push(browser.elementIdText(r.ELEMENT).value)
  });
  expect(searchString(rowValues,rowValue)).toBe(true);
});

this.When(/^I click on the "([^"]*)" button with ID "([^"]*)"$/, function (buttonValueText, buttonId) {
  browser.waitForVisible("#"+buttonId);
  expect(browser.getText("#"+buttonId)).toEqual(buttonValueText);
  browser.click("#"+buttonId)
});

this.When(/^I click on the "([^"]*)" dropdown option with ID "([^"]*)"$/, function (dropdownOptionText, dropdownOptionId) {
   browser.waitForVisible('#' + dropdownOptionId);
   expect(browser.getText('#' + dropdownOptionId)).toEqual(dropdownOptionText);
   browser.click('#' + dropdownOptionId);
});

this.Then(/^I should see the page titled "([^"]*)"$/, function (pageTitle) {
  browser.waitForVisible('h1');
  expect(browser.getText('h1')).toEqual(pageTitle);
});

this.Then(/^The Modal titled "([^"]*)" with ID "([^"]*)" should open$/, function (modalHeader, modalId) {
    browser.waitForVisible('#' + modalId);
    var bodyClass = browser.getAttribute('body','class');
    expect(searchString(bodyClass,'dimmed')).toBe(true)
    expect(browser.isVisible('#' + modalId)).toBe(true);
});

this.Then(/^The Modal titled "([^"]*)" with ID "([^"]*)" should close$/, function (modalHeader, modalId) {
  var doesNotExist = browser.waitForVisible('#' + modalId, undefined, true);
  expect(doesNotExist).toBe(true);
});
};