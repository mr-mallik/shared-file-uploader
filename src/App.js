import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Gallery from './components/Gallery';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Upload</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/" element={<FileUpload />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 