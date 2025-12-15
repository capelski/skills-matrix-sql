# Skills Matrix SQL

Skills matrix application with a React frontend, a NestJS web API and a MySQL database.

## Setup

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install [node.js](https://nodejs.org/en/download/current)
- Download [this repository](https://github.com/capelski/skills-matrix-sql.git) either by cloning it (if you have git installed) or via [zip file](https://github.com/capelski/skills-matrix-sql/archive/refs/heads/main.zip)

## Execution

- **Start**. Run the `./start.sh` script to start the full application stack and access the web app at http://localhost:3001

- **Stop**. Run the `./stop.sh` script to stop the application (it will preserve the data in the MySQL database).

## Instructions

- Due to the missing SQL commands in the `sql-commands.ts` file the web app fails to fetch data from the database.

  ![Web app error due to missing SQL command](./images/employees-list-missing-sql.png)

- Fill out all the SQL commands in `sql-commands.ts` and the web app will then be able to fetch the data.

  ![Web app loading data when the SQL command is correct](./images/employees-list-valid-sql.png)

- If any of the SQL commands are not correct the web app will display an error message in the corresponding section.

  ![Web app error due to invalid SQL command](./images/employees-list-invalid-sql.png)

## Validation

Once all the SQL commands have been provided, execute `./test.sh` to make sure your SQL statements work as expected. Note that:

- The application must be running (i.e. you must have run `./start.sh`).
- Running the tests will drop and re-create all the tables in the database, wiping out all the existing data.
- After the tests are run, the data will remain in the database and will be accessible on the web app.
- The validation might fail for different reasons:

  1.  Some of the SQL commands used in the tests setup are empty or are invalid. The tests WILL NOT run and the first error encountered will be printed in the terminal.

      ```sh
      % ./test.sh
      # ...
      Setup failure. Error executing dropEmployeesTableSql: Query was empty
      # ...
      ```

  2.  Some of the SQL commands other than the ones used in the tests setup are empty or are invalid. The tests WILL run and the first error encountered in each test will be printed in the tests output.

      ```sh
      % ./test.sh
      # ...
      Failures:

      1) Scenario: Delete an employee by Id # src/validation/employees.feature:65
        ✖ When deleting the employee with Id 21 # src/validation/employees.cucumber.ts:51
            Error: Error executing deleteEmployeeByIdSql: Query was empty
      # ...
      ```

  3.  None of the SQL commands are empty or invalid but they are not behaving as they should. The tests will run and the incorrect behavior will be described in the tests output.

      ```sh
      % ./test.sh
      Failures:

      1) Scenario: Count employees matching text filter # src/validation/employees.feature:9
        ✔ When fetching the employees count matching the text "Ni" # src/validation/employees.cucumber.ts:81
        ✖ Then the employees count is 3 # src/validation/employees.cucumber.ts:135
            AssertionError
                + expected - actual

                -21
                +3
      ```

## Architecture

- **Frontend**: React with TypeScript (port 3001)
- **API**: NestJS with mysql2 (port 3000)
- **Database**: MySQL 8.0 (port 3306)

## Database Connection Details

Once the service is running, you can connect to MySQL using:

- **Host**: `localhost`
- **Port**: `3306`
- **Database**: `skills_matrix`
- **Username**: `appuser`
- **Password**: `apppassword`
