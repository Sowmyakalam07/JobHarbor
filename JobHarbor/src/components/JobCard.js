import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { useBookmarks } from '../context/BookmarkContext';
import { formatSalary } from '../utils/formatUtils';

const JobCard = ({ job, onPress }) => {
  const { colors } = useTheme();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  
  const bookmarked = isBookmarked(job.id);

  // Handle bookmark toggle
  const handleBookmarkToggle = (e) => {
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(job.id);
    } else {
      addBookmark(job);
    }
  };

  return (
    <Card 
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.headerRow}>
          <Text 
            style={[styles.title, { color: colors.text }]} 
            numberOfLines={2}
          >
            {job.title}
          </Text>
          <IconButton
            icon={bookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            onPress={handleBookmarkToggle}
            color={bookmarked ? colors.primary : colors.text}
            style={styles.bookmarkButton}
          />
        </View>
        
        <Text 
          style={[styles.company, { color: colors.primary }]}
          numberOfLines={1}
        >
          {job.company}
        </Text>
        
        <View style={styles.infoContainer}>
          {job.location && (
            <View style={styles.infoItem}>
              <IconButton
                icon="map-marker"
                size={16}
                style={styles.infoIcon}
              />
              <Text style={{ color: colors.text }} numberOfLines={1}>
                {job.location}
              </Text>
            </View>
          )}
          
          {job.salary && (
            <View style={styles.infoItem}>
              <IconButton
                icon="currency-usd"
                size={16}
                style={styles.infoIcon}
              />
              <Text style={{ color: colors.text }} numberOfLines={1}>
                {formatSalary(job.salary)}
              </Text>
            </View>
          )}
          
          {job.phone && (
            <View style={styles.infoItem}>
              <IconButton
                icon="phone"
                size={16}
                style={styles.infoIcon}
              />
              <Text style={{ color: colors.text }} numberOfLines={1}>
                {job.phone}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  bookmarkButton: {
    margin: 0,
    marginLeft: 8,
  },
  company: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    margin: 0,
    marginRight: 4,
  },
});

export default React.memo(JobCard);
