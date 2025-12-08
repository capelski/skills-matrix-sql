import { RareSkill, SkilledEmployee } from '@skills-matrix/types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const Home: React.FC = () => {
  const [mostSkilledEmployees, setMostSkilledEmployees] = useState<SkilledEmployee[]>([]);
  const [rarestSkills, setRarestSkills] = useState<RareSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employees, skills] = await Promise.all([
          apiService.getMostSkilledEmployees(),
          apiService.getRarestSkills(),
        ]);
        setMostSkilledEmployees(employees);
        setRarestSkills(skills);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Skills matrix</h2>
      </div>

      <div className="row">
        <div className="col-xs-12">
          <p>
            Suspendisse et metus ligula. Nulla laoreet imperdiet magna, quis egestas sem rhoncus
            vitae. In non maximus sem, eget accumsan risus. Nam porttitor lorem at purus mollis
            dictum. Vestibulum eleifend lorem non est consectetur, vel dignissim eros cursus. Aenean
            magna tortor, fringilla vitae vulputate sit amet, ornare et eros. Vestibulum eget
            suscipit elit
          </p>
          <img src="/images/skills.png" className="responsive-img" alt="Skills" />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className="row align-bottom">
            <div className="col-xs-9">
              <h2>Most skilled employees</h2>
            </div>
            <div className="col-xs-3 m-bottom-10 text-right">
              <Link to="/employees">View all</Link>
            </div>
          </div>
          <ul className="list-group">
            {mostSkilledEmployees.length > 0 ? (
              mostSkilledEmployees.map((employee) => (
                <li key={employee.Id} className="list-group-item">
                  <Link to={`/employees/${employee.Id}`} className="reset">
                    {employee.Name}
                    <span className="badge floating">{employee.SkillsCount}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="list-group-item">
                <i>No employees found</i>
              </li>
            )}
          </ul>
        </div>
        <div className="col-sm-6">
          <div className="row align-bottom">
            <div className="col-xs-9">
              <h2>Rarest skills</h2>
            </div>
            <div className="col-xs-3 m-bottom-10 text-right">
              <Link to="/skills">View all</Link>
            </div>
          </div>
          <ul className="list-group">
            {rarestSkills.length > 0 ? (
              rarestSkills.map((skill) => (
                <li key={skill.Id} className="list-group-item">
                  <Link to={`/skills/${skill.Id}`} className="reset">
                    {skill.Name}
                    <span className="badge floating">{skill.EmployeesCount}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="list-group-item">
                <i>No skills found</i>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
