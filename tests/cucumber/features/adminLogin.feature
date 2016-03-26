Feature: Admin Login

  As an existing user
  I have access to the application

  Background:
    Given I am an existing user who is not logged in
    And I navigate to "/aroute"
    Then I will be redirected to "/login"

  @dev
  Scenario:
    When I login with "admin" and password "pass!"
    Then I should be redirected to the "Activity Feed"
    And Have access to admin functionality