import { EmployeeDto, Skill } from '@skills-matrix/types';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api';

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDto>({
    Id: 0,
    Name: '',
    Skills: [],
  });
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [skillsSearchKeywords, setSkillsSearchKeywords] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isNew = !id || id === 'new';
  const employeeId = isNew ? 0 : parseInt(id!, 10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!isNew) {
          const data = await apiService.getEmployee(employeeId);
          setEmployee(data!);
        } else {
          setIsEditing(true);
        }

        // Fetch available skills for adding
        const skillsData = await apiService.getSkills();
        setAvailableSkills(skillsData.Items);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setMessage('Error loading employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId, isNew]);

  const handleSave = async () => {
    if (!employee.Name.trim()) {
      setMessage('Employee name is required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isNew) {
        const newEmployee = await apiService.createEmployee(employee);
        navigate(`/employees/${newEmployee.Id}`);
      } else {
        await apiService.updateEmployee(employee);
        setMessage('Employee updated successfully');
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving employee:', error);
      setMessage('Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${employee.Name}?`)) {
      return;
    }

    setLoading(true);
    try {
      await apiService.deleteEmployee(employeeId);
      navigate('/employees');
    } catch (error) {
      console.error('Error deleting employee:', error);
      setMessage('Error deleting employee');
      setLoading(false);
    }
  };

  const handleAddSkill = (skill: Skill) => {
    const currentSkills = employee.Skills || [];
    if (!currentSkills.find((s) => s.Id === skill.Id)) {
      setEmployee({
        ...employee,
        Skills: [...currentSkills, skill],
      });
    }
  };

  const handleRemoveSkill = (skillId: number) => {
    const currentSkills = employee.Skills || [];
    setEmployee({
      ...employee,
      Skills: currentSkills.filter((s) => s.Id !== skillId),
    });
  };

  const getFilteredAvailableSkills = () => {
    const currentSkillIds = (employee.Skills || []).map((s) => s.Id);
    const filtered = availableSkills.filter(
      (skill) =>
        !currentSkillIds.includes(skill.Id) &&
        (skillsSearchKeywords === '' ||
          skill.Name.toLowerCase().includes(skillsSearchKeywords.toLowerCase())),
    );
    return filtered;
  };

  if (loading && !employee.Id && !isNew) {
    return <div className="loader">Loading employee...</div>;
  }

  const pageTitle = isNew ? 'New Employee' : employee.Name;

  return (
    <div className="employee-details">
      <div className="page-header">
        <h2>{pageTitle}</h2>
      </div>

      <form className="form-horizontal">
        <p>
          <label htmlFor="employee-name">Name</label>
        </p>
        <div className="form-group">
          <input
            id="employee-name"
            type="text"
            className="form-control"
            value={employee.Name}
            onChange={(e) => setEmployee({ ...employee, Name: e.target.value })}
            disabled={!isEditing && !isNew}
          />
        </div>

        <h3>Skills</h3>

        {/* Current Skills */}
        <div className="skills-section">
          <ul className="list-group">
            {(employee.Skills || []).length > 0 ? (
              (employee.Skills || []).map((skill) => (
                <li key={skill.Id} className="list-group-item">
                  {isEditing || isNew ? (
                    <span
                      className="remove-skill"
                      onClick={() => handleRemoveSkill(skill.Id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fa fa-times text-danger"></i> {skill.Name}
                    </span>
                  ) : (
                    <Link to={`/skills/${skill.Id}`} className="reset">
                      {skill.Name}
                    </Link>
                  )}
                </li>
              ))
            ) : (
              <li className="list-group-item">
                <i>No skills assigned yet</i>
              </li>
            )}
          </ul>
          {/* Add Skills (shown when editing) */}
          {(isEditing || isNew) && (
            <div className="add-skills-section">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search skills to add..."
                  value={skillsSearchKeywords}
                  onChange={async (e) => {
                    const keywords = e.target.value;
                    setSkillsSearchKeywords(keywords);
                    const skillsData = await apiService.getSkills({ keywords });
                    setAvailableSkills(skillsData.Items);
                  }}
                />
              </div>

              <ul className="list-group">
                {getFilteredAvailableSkills().length > 0 ? (
                  getFilteredAvailableSkills().map((skill) => (
                    <li key={skill.Id} className="list-group-item">
                      <span
                        className="add-skill"
                        onClick={() => handleAddSkill(skill)}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="fa fa-plus text-success"></i> {skill.Name}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">
                    <i>No skills found</i>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="form-actions">
          {!isEditing && !isNew && (
            <>
              <button
                type="button"
                className="btn btn-primary m-right-10"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </button>
            </>
          )}

          {(isEditing || isNew) && (
            <>
              <button
                type="button"
                className="btn btn-primary m-right-10"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={() => {
                  if (isNew) {
                    navigate('/employees');
                  } else {
                    setIsEditing(false);
                    // Reset form data
                    apiService.getEmployee(employeeId).then(setEmployee);
                  }
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>

      <hr />
      <Link to="/employees" className="btn btn-default">
        Employees list
      </Link>
    </div>
  );
};

export default EmployeeDetails;
