import { Employee, PaginatedList } from '@skills-matrix/types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<PaginatedList<Employee>>({
    Items: [],
    TotalItems: 0,
    CurrentPage: 1,
    TotalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchKeywords, setSearchKeywords] = useState('');

  const fetchEmployees = async (keywords?: string, page?: number) => {
    setLoading(true);
    try {
      const data = await apiService.getEmployees({ keywords, page });
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmployees(searchKeywords);
  };

  const handlePageChange = (newPage: number) => {
    fetchEmployees(searchKeywords, newPage);
  };

  return (
    <div className="employees">
      <div className="row align-bottom">
        <div className="col-xs-6">
          <h2>Employees</h2>
        </div>
        <div className="col-xs-6 text-right m-bottom-10">
          <Link to="/employees/new" className="btn btn-primary">
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
                placeholder="Search employees..."
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
                {employees.Items.length > 0 ? (
                  employees.Items.map((employee) => (
                    <li key={employee.Id} className="list-group-item">
                      <Link to={`/employees/${employee.Id}`} className="reset">
                        {employee.Name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">
                    <i>No employees found</i>
                  </li>
                )}
              </ul>

              {employees.TotalPages > 1 && (
                <nav className="text-center m-top-20">
                  <ul className="pagination">
                    {Array.from({ length: employees.TotalPages }, (_, i) => i).map((page) => (
                      <li key={page} className={employees.CurrentPage === page ? 'active' : ''}>
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`btn btn-link ${
                            employees.CurrentPage === page ? 'active' : ''
                          }`}
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
        </div>
      </div>
    </div>
  );
};

export default Employees;
