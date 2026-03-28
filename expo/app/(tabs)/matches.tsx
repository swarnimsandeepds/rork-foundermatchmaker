import { useFounders } from '@/contexts/FounderContext';
import { Image } from 'expo-image';
import { Heart, MapPin, Calendar } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function MatchesScreen() {
  const { matches } = useFounders();

  if (matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Heart size={64} color="#FFB3D1" strokeWidth={1.5} />
        <Text style={styles.emptyTitle}>No matches yet</Text>
        <Text style={styles.emptyText}>
          Start swiping to find your perfect co-founder match!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <Text style={styles.headerSubtitle}>
          {matches.length} connection{matches.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {matches.map((match) => (
          <MatchCard key={match.founder.id} match={match} />
        ))}
      </ScrollView>
    </View>
  );
}

function MatchCard({ match }: { match: { founder: any; matchedAt: Date } }) {
  const { founder, matchedAt } = match;
  const timeAgo = getTimeAgo(matchedAt);

  return (
    <TouchableOpacity style={styles.matchCard} activeOpacity={0.7}>
      <View style={styles.matchHeader}>
        <Image source={{ uri: founder.imageUrl }} style={styles.matchImage} />
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{founder.name}</Text>
          <Text style={styles.matchTitle}>{founder.title}</Text>
          <View style={styles.matchLocation}>
            <MapPin size={14} color="#666" />
            <Text style={styles.matchLocationText}>{founder.location}</Text>
          </View>
        </View>
        <View style={styles.matchBadge}>
          <Heart size={18} color="#FF6B9D" fill="#FF6B9D" />
        </View>
      </View>

      <Text style={styles.matchBio} numberOfLines={2}>
        {founder.bio}
      </Text>

      <View style={styles.matchSkills}>
        {founder.skills.slice(0, 3).map((skill: string) => (
          <View key={skill} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {founder.skills.length > 3 && (
          <View style={styles.skillTag}>
            <Text style={styles.skillText}>+{founder.skills.length - 3}</Text>
          </View>
        )}
      </View>

      <View style={styles.matchFooter}>
        <Calendar size={14} color="#999" />
        <Text style={styles.matchTime}>Matched {timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  matchImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F0F0',
  },
  matchInfo: {
    flex: 1,
    marginLeft: 12,
  },
  matchName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  matchTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  matchLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchLocationText: {
    fontSize: 13,
    color: '#666',
  },
  matchBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchBio: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  matchSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillTag: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD6E8',
  },
  skillText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500' as const,
  },
  matchFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  matchTime: {
    fontSize: 13,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FAFAFA',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
