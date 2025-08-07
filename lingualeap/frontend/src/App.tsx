import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import LearningSession from './pages/LearningSession';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learning-session" element={<LearningSession />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
