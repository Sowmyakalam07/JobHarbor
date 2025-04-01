import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { fetchJobs } from '../api/jobsApi';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const JobsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load jobs on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  // Filter jobs based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = jobs.filter(job => 
        job.title?.toLowerCase().includes(lowercaseQuery) ||
        job.location?.toLowerCase().includes(lowercaseQuery) ||
        job.company?.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs]);

  // Load jobs from API
  const loadJobs = async (pageToLoad = 1, shouldRefresh = false) => {
    if (loading || (pageToLoad > 1 && !hasMore)) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (shouldRefresh) {
        setRefreshing(true);
      }
      
      const newJobs = await fetchJobs(pageToLoad);
      
      if (newJobs.length === 0) {
        setHasMore(false);
      } else {
        if (shouldRefresh || pageToLoad === 1) {
          setJobs(newJobs);
        } else {
          setJobs(prevJobs => [...prevJobs, ...newJobs]);
        }
        setPage(pageToLoad);
      }
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
      if (shouldRefresh) {
        setRefreshing(false);
      }
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setHasMore(true);
    loadJobs(1, true);
  };

  // Handle load more (infinite scroll)
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadJobs(page + 1);
    }
  };

  // Navigate to job details screen
  const handleJobPress = (job) => {
    navigation.navigate('JobDetails', { job });
  };

  // Render job item
  const renderItem = ({ item }) => (
    <JobCard job={item} onPress={() => handleJobPress(item)} />
  );

  // Render footer (loading indicator)
  const renderFooter = () => {
    if (!loading || refreshing) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (loading && !refreshing) return null;
    
    if (error) {
      return (
        <EmptyState
          icon="alert-circle-outline"
          title="Something went wrong"
          message={error}
          buttonText="Try Again"
          onButtonPress={handleRefresh}
        />
      );
    }
    
    if (jobs.length === 0) {
      return (
        <EmptyState
          icon="briefcase-outline"
          title="No Jobs Found"
          message="We couldn't find any jobs at the moment."
          buttonText="Refresh"
          onButtonPress={handleRefresh}
        />
      );
    }
    
    if (filteredJobs.length === 0 && searchQuery.trim() !== '') {
      return (
        <EmptyState
          icon="search-off"
          title="No Results"
          message={`No jobs found matching "${searchQuery}"`}
          buttonText="Clear Search"
          onButtonPress={() => setSearchQuery('')}
        />
      );
    }
    
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search jobs..."
      />
      
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={filteredJobs.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default JobsScreen;
