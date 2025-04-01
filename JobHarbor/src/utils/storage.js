import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const STORAGE_KEYS = {
  BOOKMARKS: '@job_app_bookmarks',
  THEME_PREFERENCE: '@job_app_theme',
};

/**
 * Save bookmarks to AsyncStorage
 * @param {Array} bookmarks - Array of job objects to save
 * @returns {Promise<void>}
 */
export const saveBookmarks = async (bookmarks) => {
  try {
    const jsonValue = JSON.stringify(bookmarks);
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, jsonValue);
  } catch (error) {
    console.error('Error saving bookmarks:', error);
    throw error;
  }
};

/**
 * Get bookmarks from AsyncStorage
 * @returns {Promise<Array>} - Promise that resolves to array of bookmarked jobs
 */
export const getBookmarks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

/**
 * Add a job to bookmarks
 * @param {Object} job - Job object to add to bookmarks
 * @returns {Promise<Array>} - Promise that resolves to updated bookmarks array
 */
export const addBookmark = async (job) => {
  try {
    const bookmarks = await getBookmarks();
    // Check if job is already bookmarked
    if (!bookmarks.some(bookmark => bookmark.id === job.id)) {
      const updatedBookmarks = [...bookmarks, job];
      await saveBookmarks(updatedBookmarks);
      return updatedBookmarks;
    }
    return bookmarks;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

/**
 * Remove a job from bookmarks
 * @param {string|number} jobId - ID of job to remove from bookmarks
 * @returns {Promise<Array>} - Promise that resolves to updated bookmarks array
 */
export const removeBookmark = async (jobId) => {
  try {
    const bookmarks = await getBookmarks();
    const updatedBookmarks = bookmarks.filter(job => job.id !== jobId);
    await saveBookmarks(updatedBookmarks);
    return updatedBookmarks;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

/**
 * Check if a job is bookmarked
 * @param {string|number} jobId - ID of job to check
 * @returns {Promise<boolean>} - Promise that resolves to boolean indicating if job is bookmarked
 */
export const isBookmarked = async (jobId) => {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some(job => job.id === jobId);
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
};

/**
 * Save theme preference to AsyncStorage
 * @param {string} theme - Theme preference ('light', 'dark', or 'system')
 * @returns {Promise<void>}
 */
export const saveThemePreference = async (theme) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
  } catch (error) {
    console.error('Error saving theme preference:', error);
    throw error;
  }
};

/**
 * Get theme preference from AsyncStorage
 * @returns {Promise<string>} - Promise that resolves to theme preference
 */
export const getThemePreference = async () => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);
    return theme || 'system';
  } catch (error) {
    console.error('Error getting theme preference:', error);
    return 'system';
  }
};
