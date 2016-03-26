Feature: Admin Create and Delete User

  As an authenticated admin
  I can create new Users and delete existing Users

  Background:
    Given I login with "admin" and password "pass!"

 @dev
 Scenario:
    When I click on the "Control Panel" button with ID "controlPanelNav"
    And I click on the "Edit Users" dropdown option with ID "editUsersNav"
    Then I should see the page titled "Users"
    And I click on the "Add User" button with ID "addUser"
    Then The Modal titled "Add User" with ID "newUserModal" should open
    When I enter the new user info for "testuser"
    And I click on the "Save" button with ID "saveUser"
    Then The Modal titled "Add User" with ID "newUserModal" should close
    And The value "testuser" should appear in the table row "usernameRow"
