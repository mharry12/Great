import React, { useState, useEffect } from 'react';
import { Users, MapPin, Eye, Clock, Globe, Monitor } from 'lucide-react';

const FaceUserTracker = () => {
  const [faceUsers, setFaceUsers] = useState([]);
  const [trackVisitors, setTrackVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  // Mock data for testing
  const mockFaceUsers = [
    { id: 1, email: 'user1@example.com', password: 'hashed_password_123' },
    { id: 2, email: 'user2@example.com', password: 'hashed_password_456' },
    { id: 3, email: 'user3@example.com', password: 'hashed_password_789' }
  ];

  const mockTrackVisitors = [
    {
      content_id: 'content-123',
      action: 'view',
      ip_address: '203.0.113.45',
      country: 'United States',
      region: 'California',
      city: 'San Francisco',
      created_at: new Date().toISOString()
    },
    {
      content_id: 'content-456',
      action: 'click',
      ip_address: '198.51.100.22',
      country: 'Canada',
      region: 'Ontario',
      city: 'Toronto',
      created_at: new Date().toISOString()
    },
    {
      content_id: 'content-789',
      action: 'share',
      ip_address: '192.0.2.100',
      country: 'United Kingdom',
      region: 'England',
      city: 'London',
      created_at: new Date().toISOString()
    }
  ];

  const API_BASE_URL = 'https://face-ayox.onrender.com/api';

  useEffect(() => {
    fetchData();
  }, []);

  const loadMockData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setFaceUsers(mockFaceUsers);
      setTrackVisitors(mockTrackVisitors);
      setLoading(false);
      setUseMockData(true);
    }, 1000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch face users
      const faceUsersUrl = `${API_BASE_URL}/credentials/`;
      console.log('Fetching face users from:', faceUsersUrl);
      const faceUsersResponse = await fetch(faceUsersUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Face Users Response Status:', faceUsersResponse.status);
      console.log('Face Users Response Headers:', Object.fromEntries(faceUsersResponse.headers));

      if (!faceUsersResponse.ok) {
        const errorText = await faceUsersResponse.text();
        console.error('Face Users Error Response:', errorText);
        throw new Error(`Face Users API error: ${faceUsersResponse.status} - ${errorText.substring(0, 200)}`);
      }

      const faceUsersText = await faceUsersResponse.text();
      console.log('Face Users Raw Response:', faceUsersText.substring(0, 500));
      
      let faceUsersData;
      try {
        faceUsersData = JSON.parse(faceUsersText);
      } catch (parseError) {
        throw new Error(`Face Users JSON Parse Error: Response is not valid JSON. Got: ${faceUsersText.substring(0, 100)}...`);
      }

      setFaceUsers(Array.isArray(faceUsersData) ? faceUsersData : faceUsersData.results || []);

      // Fetch track visitors
      const trackVisitorsUrl = `${API_BASE_URL}/track-visitor/`;
      console.log('Fetching track visitors from:', trackVisitorsUrl);
      const trackVisitorsResponse = await fetch(trackVisitorsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Track Visitors Response Status:', trackVisitorsResponse.status);
      console.log('Track Visitors Response Headers:', Object.fromEntries(trackVisitorsResponse.headers));

      if (!trackVisitorsResponse.ok) {
        const errorText = await trackVisitorsResponse.text();
        console.error('Track Visitors Error Response:', errorText);
        throw new Error(`Track Visitors API error: ${trackVisitorsResponse.status} - ${errorText.substring(0, 200)}`);
      }

      const trackVisitorsText = await trackVisitorsResponse.text();
      console.log('Track Visitors Raw Response:', trackVisitorsText.substring(0, 500));
      
      let trackVisitorsData;
      try {
        trackVisitorsData = JSON.parse(trackVisitorsText);
      } catch (parseError) {
        throw new Error(`Track Visitors JSON Parse Error: Response is not valid JSON. Got: ${trackVisitorsText.substring(0, 100)}...`);
      }

      setTrackVisitors(Array.isArray(trackVisitorsData) ? trackVisitorsData : trackVisitorsData.data ? [trackVisitorsData.data] : []);
      setUseMockData(false);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getLocationString = (visitor) => {
    const parts = [visitor.city, visitor.region, visitor.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-indigo-700 font-medium">Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-2">
            <div className="bg-red-100 rounded-full p-1 mr-3">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-red-800 font-medium">Error Loading Data</h3>
          </div>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Face User & Visitor Analytics
          </h1>
          <p className="text-gray-600">Real-time user activity and visitor tracking dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Face Users</p>
                <p className="text-3xl font-bold text-indigo-600">{faceUsers.length}</p>
              </div>
              <Users className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tracked Visitors</p>
                <p className="text-3xl font-bold text-green-600">{trackVisitors.length}</p>
              </div>
              <Eye className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-3xl font-bold text-purple-600">{Math.min(faceUsers.length, trackVisitors.length)}</p>
              </div>
              <Monitor className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Activity & Visitor Tracking
                {useMockData && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Mock Data
                  </span>
                )}
              </h2>
              <button
                onClick={loadMockData}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 transition-colors"
              >
                Load Mock Data
              </button>
            </div>
          </div>

          {faceUsers.length === 0 && trackVisitors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              </div>
              <p className="text-gray-500 text-lg">No data available</p>
              <button
                onClick={fetchData}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Face User Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitor Tracking Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Math.max(faceUsers.length, trackVisitors.length) > 0 && 
                    Array.from({ length: Math.max(faceUsers.length, trackVisitors.length) }).map((_, index) => {
                      const faceUser = faceUsers[index];
                      const visitor = trackVisitors[index];
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          {/* Face User Column */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {faceUser ? (
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {faceUser.email || 'No Email'}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    ID: {faceUser.id || 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1 font-mono">
                                    Password: {faceUser.password ? `${faceUser.password.substring(0, 12)}...` : 'N/A'}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400 italic">No face user data</div>
                            )}
                          </td>

                          {/* Visitor Tracking Column */}
                          <td className="px-6 py-4">
                            {visitor ? (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-gray-900">
                                    {getLocationString(visitor)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Globe className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm text-gray-600">
                                    IP: {visitor.ip_address && visitor.ip_address !== API_BASE_URL ? visitor.ip_address : 'N/A'}
                                  </span>
                                </div>

                                {visitor.country && visitor.country !== API_BASE_URL && (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 text-indigo-500 flex items-center justify-center">
                                      🌍
                                    </div>
                                    <span className="text-sm text-gray-600">
                                      Country: {visitor.country}
                                    </span>
                                  </div>
                                )}

                                {visitor.content_id && (
                                  <div className="flex items-center space-x-2">
                                    <Eye className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm text-gray-600">
                                      Content: {visitor.content_id}
                                    </span>
                                  </div>
                                )}

                                {visitor.action && (
                                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {visitor.action}
                                  </div>
                                )}

                                {visitor.user_agent && (
                                  <div className="text-xs text-gray-500 max-w-xs truncate">
                                    <Monitor className="w-3 h-3 inline mr-1" />
                                    {visitor.user_agent}
                                  </div>
                                )}

                                {visitor.referrer && (
                                  <div className="text-xs text-gray-500 max-w-xs truncate">
                                    🔗 {visitor.referrer}
                                  </div>
                                )}

                                {(visitor.created_at || visitor.timestamp) && (
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      {formatDate(visitor.created_at || visitor.timestamp)}
                                    </span>
                                  </div>
                                )}

                                {/* Debug info for API response issues */}
                                {(visitor.ip_address === API_BASE_URL || visitor.country === API_BASE_URL) && (
                                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                                    <div className="text-red-600 font-medium">⚠️ API Response Issue:</div>
                                    <div className="text-red-500">IP/Country returning API URL instead of actual data</div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400 italic">No visitor tracking data</div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8 space-x-4">
          <button
            onClick={fetchData}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
          >
            Refresh Real Data
          </button>
          <button
            onClick={loadMockData}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium shadow-md"
          >
            Load Mock Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceUserTracker;