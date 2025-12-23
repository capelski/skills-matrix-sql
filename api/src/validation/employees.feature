Feature: Employees commands

  Validates fetch, count, create, update and delete operations on the Employees table

  Scenario: Count employees
    When fetching the employees count
    Then the employees count is 21

  Scenario: Count employees matching text filter
    When fetching the employees count matching the text "Ni"
    Then the employees count is 3

  Scenario: Fetch many employees (default page and page size)
    When fetching many employees
    Then the employees total is 21
    And the current employees page is 0
    And the current employees page contains 10 items
    And the first employee in the page has Name "Adam"

  Scenario: Fetch many employees (further page)
    When fetching many employees at page 2
    Then the employees total is 21
    And the current employees page is 2
    And the current employees page contains 1 items
    And the first employee in the page has Name "Zayn"

  Scenario: Fetch many employees (non-default page size)
    When fetching many employees with page size 20
    Then the employees total is 21
    And the current employees page is 0
    And the current employees page contains 20 items

  Scenario: Fetch many employees matching text filter
    When fetching many employees matching the text "Ni"
    Then the employees total is 3
    And the current employees page is 0
    And the current employees page contains 3 items
    And the first employee in the page has Name "Hani"

  Scenario: Fetch most skilled employees
    When fetching the most skilled employees
    Then 5 skilled employees are returned
    And the skilled employee at position 1 has Id 1 and skills count 5
    And the skilled employee at position 2 has Id 2 and skills count 4
    And the skilled employee at position 3 has Id 3 and skills count 3
    And the skilled employee at position 4 has Id 4 and skills count 2
    And the skilled employee at position 5 has Id 5 and skills count 1

  Scenario: Fetch an employee by Id
    When fetching the employee with Id 1
    Then the fetched employee has Name "Adele"
    And the fetched employee has Surname "Adkins"
    And the fetched employee has 5 skill(s)

  Scenario: Create an employee
    Given a new employee with Name "Amy" and Surname "Stake"
    And an association between the new employee and the skill with Id 10
    When creating the new employee
    Then the created employee has Name "Amy"
    And the created employee has Surname "Stake"
    And the created employee has 1 skill(s)

  Scenario: Create an employee (no name)
    Given a new employee with Name ""
    When creating the new employee
    Then the employee creation errors out with message "Column 'Name' cannot be null"

  Scenario: Create an employee (no surname)
    Given a new employee with Name "R2D2"
    When creating the new employee
    Then the created employee has Name "R2D2"
    And the created employee has no Surname

  Scenario: Update an employee
    Given the employee with Id 20
    When setting the employee Name to "Chris"
    And setting the employee Surname to "Peacock"
    And clearing all the employee skills
    And adding an association between the employee and the skill with Id 10
    When updating the employee
    Then the updated employee has Name "Chris"
    And the updated employee has Surname "Peacock"
    And the updated employee has 1 skill(s)

  Scenario: Delete an employee by Id
    When deleting the employee with Id 21
    And fetching the employee with Id 21
    Then the fetched employee doesn't exist
