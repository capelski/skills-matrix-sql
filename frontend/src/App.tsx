import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import EmployeeDetails from './pages/EmployeeDetails';
import Employees from './pages/Employees';
import Home from './pages/Home';
import SkillDetails from './pages/SkillDetails';
import Skills from './pages/Skills';
import SkillsMatrix from './pages/SkillsMatrix';
import Tables from './pages/Tables';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/:id" element={<SkillDetails />} />
          <Route path="/matrix" element={<SkillsMatrix />} />
          <Route path="/tables" element={<Tables />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
