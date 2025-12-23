import { useFounders } from '@/contexts/FounderContext';
import { Founder } from '@/types/founder';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Heart, X, MapPin, Briefcase } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function BrowseScreen() {
  const { availableFounders, swipeOnFounder } = useFounders();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (availableFounders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>🎉 You&apos;ve seen everyone!</Text>
        <Text style={styles.emptyText}>
          Check back later for new founders or review your matches
        </Text>
      </View>
    );
  }

  const currentFounder = availableFounders[currentIndex];

  const handleSwipe = (action: 'like' | 'pass') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    swipeOnFounder(currentFounder.id, action);
    
    if (currentIndex < availableFounders.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>
          {availableFounders.length} founder{availableFounders.length !== 1 ? 's' : ''} to meet
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {currentIndex < availableFounders.length && (
          <FounderCard
            founder={currentFounder}
            onSwipeLeft={() => handleSwipe('pass')}
            onSwipeRight={() => handleSwipe('like')}
          />
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipe('pass')}
        >
          <X color="#FF6B6B" size={32} strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleSwipe('like')}
        >
          <Heart color="#FF6B9D" size={32} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface FounderCardProps {
  founder: Founder;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

function FounderCard({ founder, onSwipeLeft, onSwipeRight }: FounderCardProps) {
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => {
            onSwipeRight();
            position.setValue({ x: 0, y: 0 });
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => {
            onSwipeLeft();
            position.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const animatedCardStyle = {
    transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
  };

  return (
    <Animated.View
      style={[styles.card, animatedCardStyle]}
      {...panResponder.panHandlers}
    >
      <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
        <Text style={styles.likeLabelText}>INTERESTED</Text>
      </Animated.View>

      <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
        <Text style={styles.nopeLabelText}>PASS</Text>
      </Animated.View>

      <Image source={{ uri: founder.imageUrl }} style={styles.cardImage} />

      <ScrollView style={styles.cardContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.cardName}>{founder.name}</Text>
        <Text style={styles.cardTitle}>{founder.title}</Text>

        <View style={styles.cardInfo}>
          <MapPin size={16} color="#666" />
          <Text style={styles.cardLocation}>{founder.location}</Text>
        </View>

        <Text style={styles.cardBio}>{founder.bio}</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Briefcase size={18} color="#FF6B9D" />
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>
          <View style={styles.tags}>
            {founder.skills.map((skill) => (
              <View key={skill} style={styles.tag}>
                <Text style={styles.tagText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={18} color="#FF6B9D" />
            <Text style={styles.sectionTitle}>Interests</Text>
          </View>
          <View style={styles.tags}>
            {founder.interests.map((interest) => (
              <View key={interest} style={[styles.tag, styles.interestTag]}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.lookingForSection}>
          <Text style={styles.lookingForLabel}>Looking for:</Text>
          <Text style={styles.lookingForText}>{founder.lookingFor}</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_HEIGHT - 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#F0F0F0',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  cardName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  cardLocation: {
    fontSize: 14,
    color: '#666',
  },
  cardBio: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1A1A1A',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD6E8',
  },
  interestTag: {
    backgroundColor: '#F0F9FF',
    borderColor: '#B3E0FF',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500' as const,
  },
  lookingForSection: {
    backgroundColor: '#FFF8F0',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE8CC',
    marginBottom: 8,
  },
  lookingForLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FF8C42',
    marginBottom: 6,
  },
  lookingForText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 10,
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    transform: [{ rotate: '15deg' }],
  },
  likeLabelText: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 10,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
  },
  nopeLabelText: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  passButton: {
    backgroundColor: '#FFF0F0',
  },
  likeButton: {
    backgroundColor: '#FFF0F5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FAFAFA',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
