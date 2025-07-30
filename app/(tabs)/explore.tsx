import React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Linking } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();

  const features = [
    {
      title: 'Kanban Board',
      description: 'Visualize your workflow with customizable columns and drag-and-drop task management.',
      icon: 'list.bullet.rectangle',
    },
    {
      title: 'Task Management',
      description: 'Create, edit, and organize tasks with priorities, due dates, and descriptions.',
      icon: 'checkmark.circle',
    },
    {
      title: 'Multiple Projects',
      description: 'Manage different projects with separate boards for better organization.',
      icon: 'folder',
    },
    {
      title: 'Offline Support',
      description: 'Your data is stored locally, so you can use the app even without an internet connection.',
      icon: 'arrow.down.circle',
    },
  ];

  const handleOpenGitHub = () => {
    Linking.openURL('https://github.com/yourusername/kanban-todo-app');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Kanban Todo App</Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].tabIconDefault }]}>
          A mobile task management app with kanban board functionality
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Features</Text>
        {features.map((feature, index) => (
          <View 
            key={index} 
            style={[
              styles.featureCard,
              { 
                backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].background,
                borderColor: Colors[colorScheme].border,
              }
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: Colors[colorScheme].tint }]}>
              <IconSymbol name={feature.icon} size={24} color="#fff" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: Colors[colorScheme].text }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: Colors[colorScheme].tabIconDefault }]}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.howToUseContainer}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>How to Use</Text>
        <View 
          style={[
            styles.howToUseCard,
            { 
              backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].background,
              borderColor: Colors[colorScheme].border,
            }
          ]}
        >
          <Text style={[styles.howToUseText, { color: Colors[colorScheme].text }]}>
            1. Create a new board from the home screen
          </Text>
          <Text style={[styles.howToUseText, { color: Colors[colorScheme].text }]}>
            2. Add columns to represent your workflow stages
          </Text>
          <Text style={[styles.howToUseText, { color: Colors[colorScheme].text }]}>
            3. Create tasks and move them between columns as they progress
          </Text>
          <Text style={[styles.howToUseText, { color: Colors[colorScheme].text }]}>
            4. Tap on a task to view details or edit it
          </Text>
        </View>
      </View>

      <View style={styles.aboutContainer}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>About KanDo</Text>
        <Text style={[styles.appTagline, { color: Colors[colorScheme].text }]}>Your day, done your way</Text>
        
        <Text style={[styles.aboutText, { color: Colors[colorScheme].tabIconDefault }]}>
          KanDo is the no-fuss Kanban app that helps you crush your to-do list with clarity and confidence.
          Built for creators, freelancers, and everyday doers, KanDo blends visual task boards with a simple,
          mobile-first experience.
        </Text>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionLabel, { color: Colors[colorScheme].tabIconDefault }]}>Version</Text>
          <Text style={[styles.versionNumber, { color: Colors[colorScheme].text }]}>
            {Constants.expoConfig?.version || '0.1.0'}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.githubButton, { backgroundColor: Colors[colorScheme].tint }]}
          onPress={handleOpenGitHub}
        >
          <IconSymbol name="link" size={18} color="#fff" />
          <Text style={styles.githubButtonText}>View Source Code</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  howToUseContainer: {
    marginBottom: 24,
  },
  howToUseCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  howToUseText: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  aboutContainer: {
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  appTagline: {
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  versionLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  versionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  githubButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
