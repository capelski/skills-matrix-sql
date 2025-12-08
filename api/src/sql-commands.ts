/*** Tables ***/

/** This command creates an employees table with the columns: Id (numerical), Name (text),
 * Surname (text). The Id column is a primary key and auto-increments with each new row */
export const createEmployeesTableSql = `
`;

/** This command creates a skills table with the columns: Id (numerical), Name (text),
 * Description (text). The Id column is a primary key and auto-increments with each new row */
export const createSkillsTableSql = `
`;

/** This command creates an employees-skills association table with the columns: EmployeeId
 * (numerical), SkillId (numerical). The primary key is made of both EmployeeId and SkillId,
 * and the table has foreign keys referencing the employees and skills tables respectively.
 * Rows on the table are deleted if either the referenced employee or skill is deleted */
export const createEmployeeSkillRelationsTableSql = `
`;

/** This command deletes all rows from the employees table */
export const deleteEmployeesTableSql = `
`;

/** This command deletes all rows from the skills table */
export const deleteSkillsTableSql = `
`;

/** This command drops the employees table */
export const dropEmployeesTableSql = `
`;

/** This command drops the skills table */
export const dropSkillsTableSql = `
`;

/** This command drops the employees-skills association table */
export const dropEmployeeSkillRelationsTableSql = `
`;

/*** Employees ***/

/** This command returns the number of employees (named as Total)
 * with a name matching :name (e.g. LIKE :name) */
export const countAllEmployeesSql = `
`;

/** This command deletes an employee with Id = :id */
export const deleteEmployeeByIdSql = `
`;

/** This command returns :limit number of employees with names matching :name (e.g. LIKE :name),
 * skipping :offset number of rows and sorting the results by Name */
export const getManyEmployeesSql = `
`;

/** This command returns an employee with Id = :id */
export const getEmployeeByIdSql = `
`;

/** This command inserts a row with Name = :name and Surname = :surname to the employees table */
export const insertEmployeeSql = `
`;

/** This command sets the Name to :name and Surname to :surname for an employee with Id = :id */
export const updateEmployeeByIdSql = `
`;

/*** Skills ***/

/** This command returns the number of skills (named as Total)
 * with a name matching :name (e.g. LIKE :name) */
export const countAllSkillsSql = `
`;

/** This command deletes a skill with Id = :id */
export const deleteSkillByIdSql = `
`;

/** This command returns :limit number of employees with names matching :name (e.g. LIKE :name),
 * skipping :offset number of rows and sorting the results by Name */
export const getManySkillsSql = `
`;

/** This command returns a skill with Id = :id */
export const getSkillByIdSql = `
`;

/** This command inserts a row with Name = :name and Description = :description to the skills table */
export const insertSkillSql = `
`;

/** This command sets the Name to :name and Description to :description for a skill with Id = :id */
export const updateSkillByIdSql = `
`;

/*** Employee-Skill Relations ***/

/** This command deletes from the employees-skills association table
 * all rows with EmployeeId = :employeeId */
export const deleteEmployeeSkillRelationByEmployeeIdSql = `
`;

/** This command deletes from the employees-skills association table
 * all rows with skillId = :skillId */
export const deleteEmployeeSkillRelationBySkillIdSql = `
`;

/** This command returns the Id and Name of all employees that have the skill with Id = :skillId */
export const getEmployeesBySkillSql = `
`;

/** This command returns the Id, Name and number of skills (named as SkillsCount) of the top 5 employees
 * with the largest number of skills, sorted by number of skills (descending) and Name (ascending) */
export const getMostSkilledEmployeesSql = `
`;

/** This command returns the Id, Name and number of employees (named as EmployeesCount) of the top 5 skills
 * with the smallest number of employees, sorted by number of employees (ascending) and Name (ascending) */
export const getRarestSkillsSql = `
`;

/** This command returns the Id and Name of all skills that the employee with Id = :employeeId has */
export const getSkillsByEmployeeSql = `
`;

/** This command inserts a row with EmployeeId = :employeeId and SkillId = :skillId to the employees-skills association table */
export const insertEmployeeSkillRelationSql = `
`;
