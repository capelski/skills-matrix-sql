Feature: Skills commands

  Validates fetch, count, create, update and delete operations on the Skills table

  Scenario: Count skills
    When fetching the skills count
    Then the skills count is 21

  Scenario: Count skills matching text filter
    When fetching the skills count matching the text "Ma"
    Then the skills count is 2

  Scenario: Fetch many skills (default page and page size)
    When fetching many skills
    Then the skills total is 21
    And the current skills page is 0
    And the current skills page contains 10 items
    And the first skill in the page has Name "MATLAB"

  Scenario: Fetch many skills (further page)
    When fetching many skills at page 2
    Then the skills total is 21
    And the current skills page is 2
    And the current skills page contains 1 items
    And the first skill in the page has Name "Occam"

  Scenario: Fetch many skills (non-default page size)
    When fetching many skills with page size 20
    Then the skills total is 21
    And the current skills page is 0
    And the current skills page contains 20 items

  Scenario: Fetch many skills matching text filter
    When fetching many skills matching the text "Ma"
    Then the skills total is 2
    And the current skills page is 0
    And the current skills page contains 2 items
    And the first skill in the page has Name "MATLAB"

  Scenario: Fetch a skill by Id
    When fetching the skill with Id 1
    Then the fetched skill has Name "Object Rexx"
    And the fetched skill has 5 employee(s)

  Scenario: Create a skill
    Given a new skill with Name "Amy" and Description "Stake"
    And an association between the new skill and the employee with Id 15
    When creating the new skill
    Then the created skill has Name "Amy"
    And the created skill has Description "Stake"
    And the created skill has 1 employee(s)

  Scenario: Update a skill
    Given the skill with Id 16
    When setting the skill Name to "Chris"
    And setting the skill Description to "Peacock"
    And clearing all the skill employees
    And adding an association between the skill and the employee with Id 16
    When updating the skill
    Then the updated skill has Name "Chris"
    And the updated skill has Description "Peacock"
    And the updated skill has 1 employee(s)

  Scenario: Delete a skill by Id
    When deleting the skill with Id 21
    And fetching the skill with Id 21
    Then the fetched skill doesn't exist
