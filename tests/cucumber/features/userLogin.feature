Feature: User Login

  As an existing user
  I have access to the application

  Background:
    Given I am an existing user who is not logged in
    And I navigate to "/aUndefinedRoute"
    Then I will be redirected to "/login"

  @dev
  Scenario:
    When I login with "user" and password "pass!"
    Then I should be redirected to the "Activity Feed"