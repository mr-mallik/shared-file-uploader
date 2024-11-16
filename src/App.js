import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import Gallery from './components/Gallery';

function App() {
  return (
    <Router>
      <div className="App uploader-bg container mx-auto p-8">
        <nav>
          <ul className="flex align-center justify-between w-3/4 m-auto pt-10">
            <li><Link className="bg-lavander text-lavander px-4 py-2 rounded-md" to="/">Upload</Link></li>
            <li><Link className="bg-lavander text-lavander px-4 py-2 rounded-md" to="/gallery">Gallery</Link></li>
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