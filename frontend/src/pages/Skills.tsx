import { PaginatedList, Skill } from '@skills-matrix/types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<PaginatedList<Skill>>({
    Items: [],
    TotalItems: 0,
    CurrentPage: 1,
    TotalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');

  const fetchSkills = async (keywords?: string, page?: number) => {
    setLoading(true);
    try {
      const data = await apiService.getSkills({ keywords, page: page ? String(page) : undefined });
      setSkills(data);
    } catch (error: any) {
      setMessage(`Error: ${error.title} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSkills(searchKeywords);
  };

  const handlePageChange = (newPage: number) => {
    fetchSkills(searchKeywords, newPage);
  };

  return (
    <div className="skills">
      <div className="row align-bottom">
        <div className="col-xs-6">
          <h2>Skills</h2>
        </div>
        <div className="col-xs-6 text-right m-bottom-10">
          <Link to="/skills/new" className="btn btn-primary">
            Create
          </Link>
        </div>
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

          <form onSubmit={handleSearch} className="form-inline m-bottom-10">
            <div className="form-group" style={{ flexGrow: 1, marginBottom: 0 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search skills..."
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-default">
              Search
            </button>
          </form>

          {loading ? (
            <div className="loader">Loading...</div>
          ) : (
            <>
              <ul className="list-group">
                {skills.Items.length > 0 ? (
                  skills.Items.map((skill) => (
                    <li key={skill.Id} className="list-group-item">
                      <Link to={`/skills/${skill.Id}`} className="reset">
                        {skill.Name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">
                    <i>No skills found</i>
                  </li>
                )}
              </ul>

              {skills.TotalPages > 1 && (
                <nav className="text-center m-top-20">
                  <ul className="pagination">
                    {Array.from({ length: skills.TotalPages }, (_, i) => i).map((page) => (
                      <li key={page} className={skills.CurrentPage === page ? 'active' : ''}>
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`btn btn-link ${skills.CurrentPage === page ? 'active' : ''}`}
                        >
                          {page + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
          )}

          {message && (
            <div
              className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;
