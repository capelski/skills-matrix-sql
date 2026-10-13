import { Employee, SkillDto } from '@skills-matrix/types';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { apiService } from '../services/api';

const SkillDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<SkillDto>({
    Description: '',
    Id: 0,
    Name: '',
    Employees: [],
  });
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [employeesSearchKeywords, setEmployeesSearchKeywords] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const isNew = !id || id === 'new';
  const skillId = isNew ? 0 : parseInt(id!, 10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!isNew) {
          const data = await apiService.getSkill(skillId);
          if (data) {
            setSkill(data);
          } else {
            setNotFound(true);
          }
        } else {
          setIsEditing(true);
        }

        // Fetch available employees for adding
        const employeesData = await apiService.getEmployees();
        setAvailableEmployees(employeesData.Items);
      } catch (error: any) {
        setMessage(error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [skillId, isNew]);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      if (isNew) {
        const newSkill = await apiService.createSkill({
          Description: skill.Description,
          EmployeeIds: skill.Employees.map((e) => e.Id),
          Name: skill.Name,
        });
        navigate(`/skills/${newSkill.Id}`);
      } else {
        await apiService.updateSkill({
          ...skill,
          EmployeeIds: skill.Employees.map((e) => e.Id),
        });
        setMessage('Skill updated successfully');
      }
      setIsEditing(false);
    } catch (error: any) {
      setMessage(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    try {
      await apiService.deleteSkill(skillId);
      navigate('/skills');
    } catch (error: any) {
      setMessage(error.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleAddEmployee = (employee: Employee) => {
    const currentEmployees = skill.Employees || [];
    if (!currentEmployees.find((e) => e.Id === employee.Id)) {
      setSkill({
        ...skill,
        Employees: [...currentEmployees, employee],
      });
    }
  };

  const handleRemoveEmployee = (employeeId: number) => {
    const currentEmployees = skill.Employees || [];
    setSkill({
      ...skill,
      Employees: currentEmployees.filter((e) => e.Id !== employeeId),
    });
  };

  const getFilteredAvailableEmployees = () => {
    const currentEmployeeIds = (skill.Employees || []).map((e) => e.Id);
    const filtered = availableEmployees.filter(
      (employee) =>
        !currentEmployeeIds.includes(employee.Id) &&
        (employeesSearchKeywords === '' ||
          employee.Name.toLowerCase().includes(employeesSearchKeywords.toLowerCase())),
    );
    return filtered;
  };

  if (loading && !skill.Id && !isNew) {
    return <div className="loader">Loading skill...</div>;
  }

  if (notFound) {
    return (
      <div className="skill-details">
        <div className="alert alert-danger">Skill not found</div>
        <Link to="/skills" className="btn btn-default">
          Skills list
        </Link>
      </div>
    );
  }

  const pageTitle = isNew ? 'New Skill' : skill.Name;

  return (
    <div className="skill-details">
      <div className="page-header">
        <h2>{pageTitle}</h2>
      </div>

      <form className="form-horizontal">
        <p>
          <label htmlFor="skill-name">Name</label>
        </p>
        <div className="form-group">
          <input
            id="skill-name"
            type="text"
            className="form-control"
            value={skill.Name}
            onChange={(e) => setSkill({ ...skill, Name: e.target.value })}
            disabled={!isEditing && !isNew}
          />
        </div>

        <p>
          <label htmlFor="skill-description">Description</label>
        </p>
        <div className="form-group">
          <textarea
            id="skill-description"
            className="form-control"
            value={skill.Description || ''}
            onChange={(e) => setSkill({ ...skill, Description: e.target.value })}
            disabled={!isEditing && !isNew}
            rows={3}
            placeholder="Enter skill description..."
          />
        </div>

        <h3>Employees</h3>

        {/* Current Employees */}
        <div className="employees-section">
          <ul className="list-group">
            {(skill.Employees || []).length > 0 ? (
              (skill.Employees || []).map((employee) => (
                <li key={employee.Id} className="list-group-item">
                  {isEditing || isNew ? (
                    <span
                      className="remove-employee"
                      onClick={() => handleRemoveEmployee(employee.Id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fa fa-times text-danger"></i> {employee.Name}
                    </span>
                  ) : (
                    <Link to={`/employees/${employee.Id}`} className="reset">
                      {employee.Name}
                    </Link>
                  )}
                </li>
              ))
            ) : (
              <li className="list-group-item">
                <i>No employees assigned yet</i>
              </li>
            )}
          </ul>

          {/* Add Employees (shown when editing) */}
          {(isEditing || isNew) && (
            <div className="add-employees-section">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search employees to add..."
                  value={employeesSearchKeywords}
                  onChange={async (e) => {
                    const keywords = e.target.value;
                    setEmployeesSearchKeywords(keywords);
                    const employeesData = await apiService.getEmployees({ keywords });
                    setAvailableEmployees(employeesData.Items);
                  }}
                />
              </div>

              <ul className="list-group">
                {getFilteredAvailableEmployees().length > 0 ? (
                  getFilteredAvailableEmployees().map((employee) => (
                    <li key={employee.Id} className="list-group-item">
                      <span
                        className="add-employee"
                        onClick={() => handleAddEmployee(employee)}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="fa fa-plus text-success"></i> {employee.Name}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">
                    <i>No employees found</i>
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
                onClick={() => setIsDeleteModalOpen(true)}
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
                    navigate('/skills');
                  } else {
                    setIsEditing(false);
                    // Reset form data
                    apiService.getSkill(skillId).then(setSkill);
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
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message={`Are you sure you want to delete ${skill.Name}?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <Link to="/skills" className="btn btn-default">
        Skills list
      </Link>
    </div>
  );
};

export default SkillDetails;
