'use client';

import { useState, useEffect, createContext, useContext, type ReactNode, useCallback } from 'react';
import { useToast } from './use-toast';

interface BookmarksContextType {
  bookmarkedIds: string[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem('ms-stories-bookmarks');
      if (storedBookmarks) {
        setBookmarkedIds(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error('Failed to parse bookmarks from localStorage', error);
      localStorage.removeItem('ms-stories-bookmarks');
    }
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds(prevIds => {
      const isCurrentlyBookmarked = prevIds.includes(id);
      let newIds;
      if (isCurrentlyBookmarked) {
        newIds = prevIds.filter(bookmarkId => bookmarkId !== id);
        toast({ title: 'Removed from bookmarks' });
      } else {
        newIds = [...prevIds, id];
        toast({ title: 'Added to bookmarks' });
      }
      localStorage.setItem('ms-stories-bookmarks', JSON.stringify(newIds));
      return newIds;
    });
  }, [toast]);

  const isBookmarked = (id: string) => bookmarkedIds.includes(id);

  return (
    <BookmarksContext.Provider value={{ bookmarkedIds, isBookmarked, toggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
