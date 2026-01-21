import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoPlatformApp from './components/Face';
import EnhancedFacebookPreview from './components/Book';
import ContentViewer from './components/ContentViewer';
import SharingPage from './components/SharingPage'; // Add this import
import Visitor from './components/Visitor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideoPlatformApp />} />
        <Route path="/share/:contentId" element={<EnhancedFacebookPreview />} />
        <Route path="/content/:contentId" element={<ContentViewer />} />
        <Route path="/share-page/:shareId" element={<SharingPage />} /> {/* Add this route */}
        <Route path="/visitor" element={<Visitor />} />
      </Routes>
    </Router>
  );
}

export default App;