import React, { createContext, useState, useContext, useEffect } from 'react';
import * as storage from '../utils/storage';

const BookmarkContext = createContext();

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks from storage on init
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const savedBookmarks = await storage.getBookmarks();
        setBookmarks(savedBookmarks || []);
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  // Add a job to bookmarks
  const addBookmark = async (job) => {
    try {
      const updatedBookmarks = [...bookmarks, job];
      setBookmarks(updatedBookmarks);
      await storage.saveBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Failed to add bookmark:', error);
    }
  };

  // Remove a job from bookmarks
  const removeBookmark = async (jobId) => {
    try {
      const updatedBookmarks = bookmarks.filter(job => job.id !== jobId);
      setBookmarks(updatedBookmarks);
      await storage.saveBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  // Check if a job is bookmarked
  const isBookmarked = (jobId) => {
    return bookmarks.some(job => job.id === jobId);
  };

  return (
    <BookmarkContext.Provider 
      value={{ 
        bookmarks, 
        loading, 
        addBookmark, 
        removeBookmark, 
        isBookmarked 
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
