import { useFounders } from '@/contexts/FounderContext';
import { Image } from 'expo-image';
import { User, MapPin, Briefcase, Heart, Edit3 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

export default function ProfileScreen() {
  const { currentUser, updateProfile } = useFounders();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(currentUser);

  const handleSave = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedProfile(currentUser);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Edit3 size={20} color="#FF6B9D" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentUser.imageUrl }}
              style={styles.profileImage}
            />
            <View style={styles.badge}>
              <User size={20} color="#FF6B9D" />
            </View>
          </View>
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.title}>{currentUser.title}</Text>
          <View style={styles.location}>
            <MapPin size={16} color="#666" />
            <Text style={styles.locationText}>{currentUser.location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{currentUser.bio}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Briefcase size={20} color="#FF6B9D" />
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>
          <View style={styles.tags}>
            {currentUser.skills.map((skill) => (
              <View key={skill} style={styles.tag}>
                <Text style={styles.tagText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={20} color="#FF6B9D" />
            <Text style={styles.sectionTitle}>Interests</Text>
          </View>
          <View style={styles.tags}>
            {currentUser.interests.map((interest) => (
              <View key={interest} style={[styles.tag, styles.interestTag]}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.lookingForSection}>
          <Text style={styles.lookingForLabel}>Looking for:</Text>
          <Text style={styles.lookingForText}>{currentUser.lookingFor}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={isEditing}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
          >
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.name}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, name: text })
                }
                placeholder="Your name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.title}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, title: text })
                }
                placeholder="Your title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.location}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, location: text })
                }
                placeholder="City, State"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile.bio}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, bio: text })
                }
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Skills (comma-separated)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile.skills.join(', ')}
                onChangeText={(text) =>
                  setEditedProfile({
                    ...editedProfile,
                    skills: text.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="React, Node.js, Python"
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Interests (comma-separated)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile.interests.join(', ')}
                onChangeText={(text) =>
                  setEditedProfile({
                    ...editedProfile,
                    interests: text.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="AI, FinTech, SaaS"
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Looking For</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile.lookingFor}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, lookingFor: text })
                }
                placeholder="What kind of co-founder are you looking for?"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FF6B9D',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF0F5',
  },
  name: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 15,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
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
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE8CC',
  },
  lookingForLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FF8C42',
    marginBottom: 8,
  },
  lookingForText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1A1A1A',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FF6B9D',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});
