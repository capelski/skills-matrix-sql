/*** Tables ***/

export const createEmployeesTableSql = `
`;

export const createSkillsTableSql = `
`;

/** This command must create an association table between employees and skills,
 * having a composite primary key made of both employeeId and skillId,
 * and foreign keys referencing the employees and skills tables respectively.
 * Rows on the table must be deleted if either the referenced employee or skill is deleted.
 */
export const createEmployeeSkillRelationsTableSql = `
`;

/*** Employees ***/

export const countAllEmployeesSql = `
`;

/** This command deletes an employee with Id = :id */
export const deleteEmployeeSql = `
`;

export const getManyEmployeesSql = `
`;

export const getOneEmployeeSql = `
`;

export const insertEmployeeSql = `
`;

export const updateEmployeeSql = `
`;

/*** Skills ***/

export const countAllSkillsSql = `
`;

/** This command deletes a skill with Id = :id */
export const deleteSkillSql = `
`;

export const getManySkillsSql = `
`;

export const getOneSkillSql = `
`;

export const insertSkillSql = `
`;

export const updateSkillSql = `
`;

/*** Employee-Skill Relations ***/

export const deleteEmployeeSkillRelationByEmployeeIdSql = `
`;

export const deleteEmployeeSkillRelationBySkillIdSql = `
`;

export const getEmployeesBySkillSql = `
`;

export const getMostSkilledEmployeesSql = `
`;

export const getRarestSkillsSql = `
`;

export const getSkillsByEmployeeSql = `
`;

export const insertEmployeeSkillRelationSql = `
`;
