import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useBoard } from '@/context/BoardContext';
import BoardList from '@/components/kanban/BoardList';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import TaskForm from '@/components/kanban/TaskForm';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  const { currentBoard } = useBoard();
  const [taskFormVisible, setTaskFormVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const colorScheme = useColorScheme();
  const { isHorizontalLayout, sidebarWidth, boardWidth, isSmallScreen } = useResponsiveLayout();

  const openTaskForm = (task = null, columnId = '') => {
    setSelectedTask(task);
    setSelectedColumn(columnId);
    setTaskFormVisible(true);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background }
      ]}
    >
      <View style={[styles.content, { flexDirection: isHorizontalLayout ? 'row' : 'column' }]}>
        {isHorizontalLayout ? (
          // Horizontal layout for medium and large screens
          <>
            {sidebarVisible && (
              <View style={[styles.sidebar, { width: sidebarWidth }]}>
                <BoardList />
              </View>
            )}
            <View style={[styles.board, { width: sidebarVisible ? boardWidth : '100%' }]}>
              <TouchableOpacity 
                style={styles.toggleButton} 
                onPress={toggleSidebar}
              >
                <IconSymbol 
                  name={sidebarVisible ? "sidebar.left" : "sidebar.right"} 
                  size={24} 
                  color={Colors[colorScheme].text} 
                />
              </TouchableOpacity>
              <KanbanBoard />
            </View>
          </>
        ) : (
          // Vertical layout for small screens
          <>
            <View style={styles.smallScreenHeader}>
              <TouchableOpacity 
                style={styles.toggleButton} 
                onPress={toggleSidebar}
              >
                <IconSymbol 
                  name={sidebarVisible ? "list.bullet.rectangle" : "rectangle.grid.1x2"} 
                  size={24} 
                  color={Colors[colorScheme].text} 
                />
              </TouchableOpacity>
            </View>
            {sidebarVisible ? (
              <View style={styles.smallScreenSidebar}>
                <BoardList />
              </View>
            ) : (
              <View style={styles.smallScreenBoard}>
                <KanbanBoard />
              </View>
            )}
          </>
        )}
      </View>

      {currentBoard && (
        <TaskForm
          visible={taskFormVisible}
          onClose={() => setTaskFormVisible(false)}
          task={selectedTask}
          boardId={currentBoard.id}
          columnId={selectedColumn}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
  sidebar: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  board: {
    flex: 1,
  },
  toggleButton: {
    padding: 12,
    zIndex: 10,
  },
  smallScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  smallScreenSidebar: {
    flex: 1,
  },
  smallScreenBoard: {
    flex: 1,
  },
});
