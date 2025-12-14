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
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchSkills = async (nextKeywords: string, nextPage: number, nextPageSize: number) => {
    setLoading(true);
    try {
      const data = await apiService.getSkills({
        keywords: nextKeywords,
        page: String(nextPage),
        pageSize: String(nextPageSize),
      });
      setSkills(data);
    } catch (error: any) {
      setMessage(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills(searchKeywords, page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchSkills(searchKeywords, 0, pageSize);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchSkills(searchKeywords, newPage, pageSize);
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

          <div className="form-group m-top-10">
            <label htmlFor="pageSize">Items per page:</label>
            <select
              id="pageSize"
              className="form-control"
              style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}
              onChange={(e) => {
                const newPageSize = parseInt(e.target.value);
                setPageSize(newPageSize);
                setPage(0);
                fetchSkills(searchKeywords, 0, newPageSize);
              }}
              value={String(pageSize)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

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
