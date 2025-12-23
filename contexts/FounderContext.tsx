import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Founder, Match, SwipeAction } from '@/types/founder';
import { MOCK_FOUNDERS, CURRENT_USER } from '@/mocks/founders';

interface FounderContextValue {
  currentUser: Founder;
  availableFounders: Founder[];
  matches: Match[];
  likedFounderIds: string[];
  swipeOnFounder: (founderId: string, action: SwipeAction) => void;
  updateProfile: (profile: Partial<Founder>) => void;
  isLoading: boolean;
  currentFounderIndex: number;
}

const STORAGE_KEYS = {
  LIKED_FOUNDERS: 'liked_founders',
  MATCHES: 'matches',
  CURRENT_USER: 'current_user',
  SWIPED_FOUNDERS: 'swiped_founders',
};

export const [FounderProvider, useFounders] = createContextHook(() => {
  const [currentUser, setCurrentUser] = useState<Founder>(CURRENT_USER);
  const [likedFounderIds, setLikedFounderIds] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [swipedFounderIds, setSwipedFounderIds] = useState<string[]>([]);

  const likedFoundersQuery = useQuery({
    queryKey: ['likedFounders'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LIKED_FOUNDERS);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const matchesQuery = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.MATCHES);
      return stored ? JSON.parse(stored).map((m: Match) => ({
        ...m,
        matchedAt: new Date(m.matchedAt),
      })) : [];
    },
  });

  const currentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : CURRENT_USER;
    },
  });

  const swipedFoundersQuery = useQuery({
    queryKey: ['swipedFounders'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SWIPED_FOUNDERS);
      return stored ? JSON.parse(stored) : [];
    },
  });

  useEffect(() => {
    if (likedFoundersQuery.data) {
      setLikedFounderIds(likedFoundersQuery.data);
    }
  }, [likedFoundersQuery.data]);

  useEffect(() => {
    if (matchesQuery.data) {
      setMatches(matchesQuery.data);
    }
  }, [matchesQuery.data]);

  useEffect(() => {
    if (currentUserQuery.data) {
      setCurrentUser(currentUserQuery.data);
    }
  }, [currentUserQuery.data]);

  useEffect(() => {
    if (swipedFoundersQuery.data) {
      setSwipedFounderIds(swipedFoundersQuery.data);
    }
  }, [swipedFoundersQuery.data]);

  const saveLikedFoundersMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await AsyncStorage.setItem(STORAGE_KEYS.LIKED_FOUNDERS, JSON.stringify(ids));
      return ids;
    },
  });

  const saveMatchesMutation = useMutation({
    mutationFn: async (newMatches: Match[]) => {
      await AsyncStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(newMatches));
      return newMatches;
    },
  });

  const saveCurrentUserMutation = useMutation({
    mutationFn: async (user: Founder) => {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    },
  });

  const saveSwipedFoundersMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await AsyncStorage.setItem(STORAGE_KEYS.SWIPED_FOUNDERS, JSON.stringify(ids));
      return ids;
    },
  });

  const swipeOnFounder = (founderId: string, action: SwipeAction) => {
    const newSwipedIds = [...swipedFounderIds, founderId];
    setSwipedFounderIds(newSwipedIds);
    saveSwipedFoundersMutation.mutate(newSwipedIds);

    if (action === 'like') {
      const newLikedIds = [...likedFounderIds, founderId];
      setLikedFounderIds(newLikedIds);
      saveLikedFoundersMutation.mutate(newLikedIds);

      const founder = MOCK_FOUNDERS.find((f) => f.id === founderId);
      if (founder && Math.random() > 0.5) {
        const newMatch: Match = {
          founder,
          matchedAt: new Date(),
        };
        const newMatches = [newMatch, ...matches];
        setMatches(newMatches);
        saveMatchesMutation.mutate(newMatches);
      }
    }
  };

  const updateProfile = (profile: Partial<Founder>) => {
    const updated = { ...currentUser, ...profile };
    setCurrentUser(updated);
    saveCurrentUserMutation.mutate(updated);
  };

  const availableFounders = MOCK_FOUNDERS.filter(
    (f) => !swipedFounderIds.includes(f.id)
  );

  return {
    currentUser,
    availableFounders,
    matches,
    likedFounderIds,
    swipeOnFounder,
    updateProfile,
    isLoading: likedFoundersQuery.isLoading || matchesQuery.isLoading,
    currentFounderIndex: MOCK_FOUNDERS.length - availableFounders.length,
  };
});
