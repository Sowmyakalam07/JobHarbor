import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';

// Sample job data (same as in our API module)
const SAMPLE_JOBS = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    description: 'We are looking for an experienced React Native developer.',
    salary: 120000,
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'WebSolutions Inc.',
    location: 'Remote',
    description: 'Create responsive and intuitive user interfaces.',
    salary: 95000,
  },
  {
    id: '3',
    title: 'Mobile App Designer',
    company: 'CreativeUX',
    location: 'New York, NY',
    description: 'Design beautiful mobile app interfaces.',
    salary: 90000,
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudSystems',
    location: 'Chicago, IL',
    description: 'Automate and optimize infrastructure.',
    salary: 115000,
  },
  {
    id: '5',
    title: 'Backend Developer',
    company: 'DataTech',
    location: 'Austin, TX',
    description: 'Build robust backend services.',
    salary: 110000,
  }
];

// JobCard Component
const JobCard = ({ job, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.title}>{job.title}</Text>
    <Text style={styles.company}>{job.company}</Text>
    <Text style={styles.location}>{job.location}</Text>
    <Text style={styles.salary}>
      {job.salary ? `$${job.salary.toLocaleString()}` : 'Salary not specified'}
    </Text>
  </TouchableOpacity>
);

// JobDetails Component
const JobDetailsScreen = ({ job, onBack }) => (
  <View style={styles.detailsContainer}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backButtonText}>← Back to Jobs</Text>
    </TouchableOpacity>
    
    <Text style={styles.detailsTitle}>{job.title}</Text>
    <Text style={styles.detailsCompany}>{job.company}</Text>
    <Text style={styles.detailsLocation}>{job.location}</Text>
    <Text style={styles.detailsSalary}>
      {job.salary ? `$${job.salary.toLocaleString()}` : 'Salary not specified'}
    </Text>
    <Text style={styles.detailsDescription}>{job.description}</Text>
  </View>
);

// Main App Component
export default function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    // Simulate loading jobs
    console.log('App initializing...');
    console.log('Platform: ', Platform.OS);
    
    setTimeout(() => {
      setJobs(SAMPLE_JOBS);
      setLoading(false);
    }, 1000);
  }, []);

  const handleJobPress = (job) => {
    setSelectedJob(job);
  };

  const handleBackPress = () => {
    setSelectedJob(null);
  };

  const toggleBookmark = (job) => {
    const isBookmarked = bookmarks.some(bookmark => bookmark.id === job.id);
    
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== job.id));
    } else {
      setBookmarks([...bookmarks, job]);
    }
  };

  const isBookmarked = (jobId) => {
    return bookmarks.some(bookmark => bookmark.id === jobId);
  };

  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading Jobs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render job details if a job is selected
  if (selectedJob) {
    return (
      <SafeAreaView style={styles.container}>
        <JobDetailsScreen job={selectedJob} onBack={handleBackPress} />
      </SafeAreaView>
    );
  }

  // Render job list or bookmarks
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Listings</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'jobs' && styles.activeTab]} 
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>
            Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bookmarks' && styles.activeTab]} 
          onPress={() => setActiveTab('bookmarks')}
        >
          <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>
            Bookmarks
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'jobs' && (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.jobCardContainer}>
              <JobCard job={item} onPress={() => handleJobPress(item)} />
              <TouchableOpacity 
                style={styles.bookmarkButton}
                onPress={() => toggleBookmark(item)}
              >
                <Text style={styles.bookmarkButtonText}>
                  {isBookmarked(item.id) ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}
      
      {activeTab === 'bookmarks' && (
        bookmarks.length > 0 ? (
          <FlatList
            data={bookmarks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.jobCardContainer}>
                <JobCard job={item} onPress={() => handleJobPress(item)} />
                <TouchableOpacity 
                  style={styles.bookmarkButton}
                  onPress={() => toggleBookmark(item)}
                >
                  <Text style={styles.bookmarkButtonText}>★</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No bookmarks yet</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setActiveTab('jobs')}
            >
              <Text style={styles.emptyStateButtonText}>Browse Jobs</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 16,
    paddingTop: 24,
    elevation: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6200ee',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  jobCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  company: {
    fontSize: 16,
    color: '#6200ee',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  salary: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookmarkButton: {
    marginLeft: 12,
    padding: 10,
  },
  bookmarkButtonText: {
    fontSize: 24,
    color: '#6200ee',
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6200ee',
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsCompany: {
    fontSize: 18,
    color: '#6200ee',
    marginBottom: 8,
  },
  detailsLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  detailsSalary: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailsDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#666',
  },
  emptyStateButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
