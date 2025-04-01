import React from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookmarks } from '../context/BookmarkContext';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';

const BookmarksScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { bookmarks, loading } = useBookmarks();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredBookmarks, setFilteredBookmarks] = React.useState([]);

  // Filter bookmarks based on search query
  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBookmarks(bookmarks);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = bookmarks.filter(job => 
        job.title?.toLowerCase().includes(lowercaseQuery) ||
        job.location?.toLowerCase().includes(lowercaseQuery) ||
        job.company?.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredBookmarks(filtered);
    }
  }, [searchQuery, bookmarks]);

  // Navigate to job details screen
  const handleJobPress = (job) => {
    navigation.navigate('JobDetails', { job });
  };

  // Render job item
  const renderItem = ({ item }) => (
    <JobCard job={item} onPress={() => handleJobPress(item)} />
  );

  // Render empty state
  const renderEmpty = () => {
    if (loading) return null;
    
    if (bookmarks.length === 0) {
      return (
        <EmptyState
          icon="bookmark-outline"
          title="No Bookmarks"
          message="You haven't bookmarked any jobs yet."
          buttonText="Browse Jobs"
          onButtonPress={() => navigation.navigate('Jobs')}
        />
      );
    }
    
    if (filteredBookmarks.length === 0 && searchQuery.trim() !== '') {
      return (
        <EmptyState
          icon="search-off"
          title="No Results"
          message={`No bookmarked jobs found matching "${searchQuery}"`}
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
        placeholder="Search bookmarks..."
      />
      
      <FlatList
        data={filteredBookmarks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={filteredBookmarks.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmpty}
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
});

export default BookmarksScreen;
