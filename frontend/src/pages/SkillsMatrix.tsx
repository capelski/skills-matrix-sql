import { EmployeeDto, Skill } from '@skills-matrix/types';
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';

interface SkillsMatrixData {
  employees: EmployeeDto[];
  skills: Skill[];
}

const SkillsMatrix: React.FC = () => {
  const [matrixData, setMatrixData] = useState<SkillsMatrixData>({
    employees: [],
    skills: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
        const [employeesData, skillsData] = await Promise.all([
          apiService.getEmployees({ pageSize: 1000 }),
          apiService.getSkills({ pageSize: 1000 }),
        ]);

        // Fetch detailed data for each employee to get their skills
        const employeesWithSkills = await Promise.all(
          employeesData.Items.map(async (employee) => {
            try {
              return await apiService.getEmployee(employee.Id);
            } catch (error) {
              console.error(`Error fetching employee ${employee.Id}:`, error);
              return { ...employee, Skills: [] };
            }
          }),
        );

        setMatrixData({
          employees: employeesWithSkills,
          skills: skillsData.Items,
        });
      } catch (error) {
        console.error('Error fetching matrix data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrixData();
  }, []);

  const hasSkill = (employee: EmployeeDto, skill: Skill): boolean => {
    return employee.Skills.some((employeeSkill) => employeeSkill.Id === skill.Id) || false;
  };

  if (loading) {
    return <div className="loader">Loading skills matrix...</div>;
  }

  return (
    <div className="skills-matrix">
      <div className="page-header">
        <h2>Skills Matrix</h2>
      </div>

      <div className="row">
        <div className="col-xs-12">
          <p>
            This matrix shows which employees have which skills. A checkmark (✓) indicates that an
            employee possesses the skill.
          </p>

          {matrixData.employees.length === 0 || matrixData.skills.length === 0 ? (
            <div className="alert alert-info">
              No employees or skills found. Please create some employees and skills first.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped skills-matrix-table">
                <thead>
                  <tr>
                    <th className="employee-header">Employee</th>
                    {matrixData.skills.map((skill) => (
                      <th key={skill.Id} className="skill-header">
                        <div className="skill-header-content">{skill.Name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixData.employees.map((employee) => (
                    <tr key={employee.Id}>
                      <td className="employee-cell">
                        <strong>{employee.Name}</strong>
                      </td>
                      {matrixData.skills.map((skill) => (
                        <td key={skill.Id} className="skill-cell">
                          {hasSkill(employee, skill) ? (
                            <span className="skill-indicator has-skill">✓</span>
                          ) : (
                            <span className="skill-indicator no-skill">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsMatrix;
