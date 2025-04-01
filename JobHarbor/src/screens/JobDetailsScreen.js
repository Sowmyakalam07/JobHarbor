import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Linking, 
  TouchableOpacity 
} from 'react-native';
import { 
  Text,
  Divider,
  IconButton,
  Button,
  useTheme,
  Card,
  Chip
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookmarks } from '../context/BookmarkContext';
import { formatSalary, formatDate } from '../utils/formatUtils';

const JobDetailsScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  
  const bookmarked = isBookmarked(job.id);

  // Toggle bookmark status
  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(job.id);
    } else {
      addBookmark(job);
    }
  };

  // Handle phone call
  const handleCall = () => {
    if (job.phone) {
      Linking.openURL(`tel:${job.phone}`);
    }
  };

  // Handle email
  const handleEmail = () => {
    if (job.email) {
      Linking.openURL(`mailto:${job.email}`);
    }
  };

  // Handle website visit
  const handleWebsite = () => {
    if (job.website) {
      Linking.openURL(job.website);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with back button and bookmark button */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.surface }]}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          Job Details
        </Text>
        <IconButton
          icon={bookmarked ? "bookmark" : "bookmark-outline"}
          size={24}
          onPress={toggleBookmark}
          color={bookmarked ? colors.primary : colors.text}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Job title and company section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
            <Text style={[styles.companyName, { color: colors.primary }]}>{job.company}</Text>
            
            <View style={styles.locationContainer}>
              <IconButton
                icon="map-marker"
                size={20}
                style={styles.inlineIcon}
              />
              <Text style={{ color: colors.text }}>{job.location}</Text>
            </View>
            
            {job.salary && (
              <View style={styles.salaryContainer}>
                <IconButton
                  icon="currency-usd"
                  size={20}
                  style={styles.inlineIcon}
                />
                <Text style={{ color: colors.text }}>{formatSalary(job.salary)}</Text>
              </View>
            )}
            
            {job.posted_at && (
              <View style={styles.dateContainer}>
                <IconButton
                  icon="calendar"
                  size={20}
                  style={styles.inlineIcon}
                />
                <Text style={{ color: colors.text }}>Posted {formatDate(job.posted_at)}</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Job description */}
        {job.description && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
              <Text style={{ color: colors.text }}>{job.description}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Requirements section */}
        {job.requirements && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Requirements</Text>
              <Text style={{ color: colors.text }}>{job.requirements}</Text>
            </Card.Content>
          </Card>
        )}

        {/* Skills section */}
        {job.skills && job.skills.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills</Text>
              <View style={styles.skillsContainer}>
                {job.skills.map((skill, index) => (
                  <Chip key={index} style={styles.skillChip}>{skill}</Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Contact information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
            
            {job.phone && (
              <TouchableOpacity onPress={handleCall} style={styles.contactItem}>
                <IconButton
                  icon="phone"
                  size={20}
                  style={styles.inlineIcon}
                  color={colors.primary}
                />
                <Text style={{ color: colors.primary }}>{job.phone}</Text>
              </TouchableOpacity>
            )}
            
            {job.email && (
              <TouchableOpacity onPress={handleEmail} style={styles.contactItem}>
                <IconButton
                  icon="email"
                  size={20}
                  style={styles.inlineIcon}
                  color={colors.primary}
                />
                <Text style={{ color: colors.primary }}>{job.email}</Text>
              </TouchableOpacity>
            )}
            
            {job.website && (
              <TouchableOpacity onPress={handleWebsite} style={styles.contactItem}>
                <IconButton
                  icon="web"
                  size={20}
                  style={styles.inlineIcon}
                  color={colors.primary}
                />
                <Text style={{ color: colors.primary }}>{job.website}</Text>
              </TouchableOpacity>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* Apply button */}
      <View style={[styles.applyButtonContainer, { paddingBottom: insets.bottom || 16, backgroundColor: colors.surface }]}>
        <Button
          mode="contained"
          onPress={handleCall}
          style={styles.applyButton}
          labelStyle={styles.applyButtonLabel}
        >
          Apply Now
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inlineIcon: {
    margin: 0,
    marginRight: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    margin: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  applyButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  applyButton: {
    paddingVertical: 8,
  },
  applyButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobDetailsScreen;
