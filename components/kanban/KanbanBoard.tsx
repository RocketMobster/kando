import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import { useBoard, Column, Task } from '@/context/BoardContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  onAddTask?: (task: any, columnId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onAddTask }) => {
  const { currentBoard, addColumn, updateColumn, deleteColumn, moveTask } = useBoard();
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [editingColumn, setEditingColumn] = useState<{ id: string; title: string } | null>(null);
  const [draggingTask, setDraggingTask] = useState<{ taskId: string; columnId: string } | null>(null);
  const colorScheme = useColorScheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const { layoutSize, isSmallScreen } = useResponsiveLayout();

  // Calculate column width based on screen size
  const getColumnWidth = () => {
    if (isSmallScreen) {
      return width * 0.85; // 85% of screen width on small screens
    } else if (layoutSize === 'medium') {
      return width * 0.7; // 70% of screen width on medium screens
    } else {
      return 300; // Fixed width on large screens
    }
  };

  const COLUMN_WIDTH = getColumnWidth();
  const COLUMN_MARGIN = 10;

  const handleAddColumn = () => {
    if (!currentBoard) return;
    
    if (newColumnTitle.trim() === '') {
      window.alert('Column title cannot be empty');
      return;
    }

    addColumn(currentBoard.id, newColumnTitle.trim());
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  const handleUpdateColumn = () => {
    if (!currentBoard || !editingColumn) return;

    if (editingColumn.title.trim() === '') {
      window.alert('Column title cannot be empty');
      return;
    }

    const column = currentBoard.columns?.find(col => col.id === editingColumn.id);
    if (column) {
      updateColumn(currentBoard.id, {
        ...column,
        title: editingColumn.title.trim(),
      });
    }

    setEditingColumn(null);
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!currentBoard) return;

    const confirmed = window.confirm('Are you sure you want to delete this column? All tasks in this column will be deleted.');
    if (confirmed) {
      deleteColumn(currentBoard.id, columnId);
    }
  };

  const handleDragStart = (taskId: string, columnId: string) => {
    setDraggingTask({ taskId, columnId });
  };

  const handleDragEnd = (destinationColumnId: string) => {
    if (!currentBoard || !draggingTask) return;

    if (draggingTask.columnId !== destinationColumnId) {
      moveTask(
        currentBoard.id,
        draggingTask.columnId,
        destinationColumnId,
        draggingTask.taskId
      );
    }

    setDraggingTask(null);
  };

  if (!currentBoard) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>
          No board selected. Please select or create a board to get started.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.boardTitle, { color: Colors[colorScheme].text }]}>
          {currentBoard.title}
        </Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setIsAddingColumn(true)}
        >
          <IconSymbol name="plus.circle.fill" size={24} color={Colors[colorScheme].tint} />
          <Text style={[styles.addButtonText, { color: Colors[colorScheme].tint }]}>Add Column</Text>
        </TouchableOpacity>
      </View>

      {isAddingColumn ? (
        <View style={[styles.addColumnContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors[colorScheme].text,
                backgroundColor: Colors[colorScheme].background,
                borderColor: Colors[colorScheme].border
              }
            ]}
            placeholder="Column name"
            placeholderTextColor={Colors[colorScheme].tabIconDefault}
            value={newColumnTitle}
            onChangeText={setNewColumnTitle}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAddColumn}
          />
          <View style={styles.addColumnButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => {
                setIsAddingColumn(false);
                setNewColumnTitle('');
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleAddColumn}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.columnsContainer}
        snapToInterval={COLUMN_WIDTH + COLUMN_MARGIN * 2}
        decelerationRate="fast"
      >
        {currentBoard.columns?.map((column) => (
          <View 
            key={column.id} 
            style={[
              styles.column,
              { 
                backgroundColor: Colors[colorScheme].background,
                borderColor: Colors[colorScheme].border,
                width: COLUMN_WIDTH,
                marginHorizontal: COLUMN_MARGIN,
              }
            ]}
            onStartShouldSetResponder={() => draggingTask !== null}
            onResponderRelease={() => draggingTask && handleDragEnd(column.id)}
          >
            <View style={styles.columnHeader}>
              {editingColumn && editingColumn.id === column.id ? (
                <TextInput
                  style={[
                    styles.columnTitleInput,
                    { color: Colors[colorScheme].text }
                  ]}
                  value={editingColumn.title}
                  onChangeText={(text) => setEditingColumn({ ...editingColumn, title: text })}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleUpdateColumn}
                  onBlur={handleUpdateColumn}
                />
              ) : (
                <TouchableOpacity 
                  style={styles.columnTitleContainer}
                  onPress={() => setEditingColumn({ id: column.id, title: column.title })}
                >
                  <Text style={[styles.columnTitle, { color: Colors[colorScheme].text }]}>
                    {column.title}
                  </Text>
                  <Text style={[styles.taskCount, { color: Colors[colorScheme].tabIconDefault }]}>
                    {column.tasks.length}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDeleteColumn(column.id)}
              >
                <IconSymbol name="trash" size={18} color={Colors[colorScheme].tabIconDefault} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.tasksContainer}>
              {column.tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  columnId={column.id}
                  onDragStart={handleDragStart}
                  isDragging={draggingTask?.taskId === task.id}
                />
              ))}

              <TouchableOpacity 
                style={[
                  styles.addTaskButton,
                  { borderColor: Colors[colorScheme].border }
                ]}
                onPress={() => {
                  if (currentBoard && onAddTask) {
                    onAddTask(null, column.id);
                  }
                }}
              >
                <IconSymbol name="plus" size={16} color={Colors[colorScheme].tabIconDefault} />
                <Text style={[styles.addTaskText, { color: Colors[colorScheme].tabIconDefault }]}>
                  Add Task
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  boardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  columnsContainer: {
    paddingHorizontal: 6,
    paddingBottom: 16,
  },
  column: {
    borderRadius: 12,
    borderWidth: 1,
    height: '100%',
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  columnTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  columnTitleInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
  },
  taskCount: {
    fontSize: 14,
    fontWeight: '400',
  },
  deleteButton: {
    padding: 4,
  },
  tasksContainer: {
    flex: 1,
    padding: 8,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addTaskText: {
    marginLeft: 8,
    fontSize: 14,
  },
  addColumnContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  addColumnButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  saveButtonText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default KanbanBoard;