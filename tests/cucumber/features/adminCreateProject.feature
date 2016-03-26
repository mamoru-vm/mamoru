Feature: Admin Create Project

  As an authenticated admin
  I can create new Projects and delete existing Projects

  Background:
    Given I login with "admin" and password "pass!"

  @dev
  Scenario:
    When I click on the "Control Panel" button with ID "controlPanelNav"
    And I click on the "Edit Projects" dropdown option with ID "editProjectsNav"
    Then I should see the page titled "Projects"
    When I click on the "Add Project" button with ID "addProject" 
    Then The Modal titled "Add Project" with ID "newProjModal" should open
    When I enter the Project Name "test project"
    And  I click on the "Save Project" button with ID "saveProj"
    Then The Modal titled "Add Project" with ID "newProjModal" should close
    And The value "Test Project" should appear in the table row "projectNameRow"

