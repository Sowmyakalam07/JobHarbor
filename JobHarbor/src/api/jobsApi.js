import axios from 'axios';
import { Platform } from 'react-native';

// Base URL for the API
const BASE_URL = 'https://testapi.getlokalapp.com/common';

// Sample job data in case API is unavailable (e.g. CORS issues on web)
const SAMPLE_JOBS = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    description: 'We are looking for an experienced React Native developer to join our mobile team. You will be responsible for building cross-platform mobile applications using React Native.',
    requirements: 'At least 3 years of experience with React Native. Proficiency in JavaScript/TypeScript. Experience with state management solutions like Redux or Context API.',
    salary: 120000,
    phone: '(555) 123-4567',
    email: 'jobs@techcorp.com',
    website: 'https://techcorp.com/careers',
    posted_at: '2025-03-15T10:00:00Z',
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'API Integration'],
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'WebSolutions Inc.',
    location: 'Remote',
    description: 'WebSolutions is seeking a talented Frontend Developer to create responsive and intuitive user interfaces for our web applications.',
    requirements: 'Strong HTML, CSS, and JavaScript skills. Experience with modern frontend frameworks like React, Vue, or Angular.',
    salary: 95000,
    phone: '(555) 987-6543',
    email: 'careers@websolutions.com',
    website: 'https://websolutions.com/jobs',
    posted_at: '2025-03-20T14:30:00Z',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design'],
  },
  {
    id: '3',
    title: 'Mobile App Designer',
    company: 'CreativeUX',
    location: 'New York, NY',
    description: 'Join our design team to create beautiful and functional mobile app interfaces that delight users.',
    requirements: 'Portfolio showcasing mobile UI/UX design. Proficiency with design tools like Figma or Sketch. Understanding of mobile design principles.',
    salary: 90000,
    phone: '(555) 456-7890',
    email: 'design@creativeUX.com',
    website: 'https://creativeUX.com',
    posted_at: '2025-03-22T09:15:00Z',
    skills: ['UI/UX Design', 'Figma', 'Mobile Design', 'Prototyping', 'User Research'],
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudSystems',
    location: 'Chicago, IL',
    description: 'CloudSystems is looking for a DevOps Engineer to help automate and optimize our infrastructure and deployment processes.',
    requirements: 'Experience with CI/CD pipelines. Knowledge of AWS or Azure. Familiarity with containerization technologies like Docker and Kubernetes.',
    salary: 115000,
    phone: '(555) 234-5678',
    email: 'hiring@cloudsystems.com',
    website: 'https://cloudsystems.com/careers',
    posted_at: '2025-03-18T11:45:00Z',
    skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  {
    id: '5',
    title: 'Backend Developer',
    company: 'DataTech',
    location: 'Austin, TX',
    description: 'Build robust and scalable backend services for our data processing platform.',
    requirements: 'Strong experience with Node.js, Python, or Java. Knowledge of database design and optimization. Experience with RESTful API development.',
    salary: 110000,
    phone: '(555) 876-5432',
    email: 'jobs@datatech.io',
    website: 'https://datatech.io',
    posted_at: '2025-03-25T13:20:00Z',
    skills: ['Node.js', 'Python', 'SQL', 'RESTful APIs', 'Database Design'],
  }
];

// Axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch jobs from API with pagination, with fallback for web
 * @param {number} page - Page number to fetch
 * @param {number} limit - Number of items per page
 * @returns {Promise<Array>} - Promise that resolves to array of jobs
 */
export const fetchJobs = async (page = 1, limit = 10) => {
  // Calculate start and end indices for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  try {
    console.log(`Fetching jobs: page ${page}, limit ${limit}`);
    
    // For web platform, due to potential CORS issues, use sample data
    if (Platform.OS === 'web') {
      console.log('Using sample job data for web platform');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return paginated sample data
      return SAMPLE_JOBS.slice(startIndex, endIndex);
    }
    
    // For native platforms, try to fetch from API
    const response = await api.get(`/jobs`, {
      params: {
        page,
        limit,
      },
    });
    
    // Process job data to ensure consistent structure
    const processedJobs = response.data.map(job => ({
      id: job.id || Math.random().toString(36).substr(2, 9),
      title: job.title || 'Untitled Position',
      company: job.company || 'Unknown Company',
      location: job.location || 'Remote',
      description: job.description || '',
      requirements: job.requirements || '',
      salary: job.salary || null,
      phone: job.phone || null,
      email: job.email || null,
      website: job.website || null,
      posted_at: job.posted_at || new Date().toISOString(),
      skills: job.skills || [],
    }));
    
    return processedJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    
    // On API failure, use sample data as fallback
    console.log('API failed, using sample job data as fallback');
    
    // Return paginated sample data
    return SAMPLE_JOBS.slice(startIndex, endIndex);
  }
};

/**
 * Fetch a specific job by ID, with fallback for web
 * @param {string|number} jobId - The ID of the job to fetch
 * @returns {Promise<Object>} - Promise that resolves to job object
 */
export const fetchJobById = async (jobId) => {
  try {
    // For web platform, use sample data
    if (Platform.OS === 'web') {
      console.log(`Using sample job data for web platform, job ID: ${jobId}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find job in sample data
      const job = SAMPLE_JOBS.find(job => job.id === jobId.toString());
      
      if (!job) {
        throw new Error(`Job with ID ${jobId} not found`);
      }
      
      return job;
    }
    
    // For native platforms, try to fetch from API
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with ID ${jobId}:`, error);
    
    // On API failure, try to find job in sample data
    const job = SAMPLE_JOBS.find(job => job.id === jobId.toString());
    
    if (job) {
      return job;
    }
    
    throw error;
  }
};
