import React from 'react';
import { useParams } from 'react-router-dom';

const ContentViewer = () => {
  const { contentId } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Content Viewer</h1>
        <p className="mb-4">You're now viewing content with ID: {contentId}</p>
        <p className="text-green-600 font-semibold">Login was successful!</p>
      </div>
    </div>
  );
};

export default ContentViewer;