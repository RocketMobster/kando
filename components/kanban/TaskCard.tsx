import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  PanResponder,
  PanResponderInstance,
} from 'react-native';
import { useBoard, Task } from '@/context/BoardContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface TaskCardProps {
  task: Task;
  columnId: string;
  onDragStart?: (taskId: string, columnId: string) => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, columnId, onDragStart, isDragging = false }) => {
  const { currentBoard, updateTask, deleteTask } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const colorScheme = useColorScheme();
  const { layoutSize } = useResponsiveLayout();
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef<PanResponderInstance>();

  // Initialize PanResponder
  React.useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
        onDragStart && onDragStart(task.id, columnId);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        // Reset position after drag
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    });
  }, [pan, onDragStart, task.id, columnId]);

  const toggleTaskCompletion = () => {
    if (!currentBoard) return;

    updateTask(currentBoard.id, columnId, {
      ...task,
      completed: !task.completed,
    });
  };

  const handleDeleteTask = () => {
    if (!currentBoard) return;

    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => currentBoard && deleteTask(currentBoard.id, columnId, task.id) 
        },
      ]
    );
  };

  const handleEditTask = () => {
    setIsEditing(true);
    // This would typically open a modal or navigate to an edit screen
    Alert.alert(
      'Edit Task',
      'This will navigate to the Edit Task screen',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => console.log('Navigate to edit task screen for task:', task.id) 
        },
      ]
    );
  };

  // Get priority color
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return '#E53935'; // Red
      case 'medium':
        return '#FB8C00'; // Orange
      case 'low':
        return '#43A047'; // Green
      default:
        return '#757575'; // Gray
    }
  };

  // Format date to readable string
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }
    
    // For other dates, show month and day
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Determine if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };
  
  // Get due date color based on status
  const getDueDateColor = () => {
    if (isOverdue()) {
      return Colors[colorScheme].error;
    }
    
    if (!task.dueDate) return Colors[colorScheme].tabIconDefault;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // If due today or tomorrow, show warning color
    if (dueDate.getTime() === today.getTime() || dueDate.getTime() === tomorrow.getTime()) {
      return Colors[colorScheme].warning;
    }
    
    return Colors[colorScheme].tabIconDefault;
  };

  // Adjust font size based on screen size
  const getTitleFontSize = () => {
    switch (layoutSize) {
      case 'small':
        return 14;
      case 'medium':
        return 15;
      case 'large':
        return 16;
      default:
        return 15;
    }
  };

  const getDescriptionFontSize = () => {
    switch (layoutSize) {
      case 'small':
        return 12;
      case 'medium':
        return 13;
      case 'large':
        return 14;
      default:
        return 13;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor: Colors[colorScheme].background,
          borderColor: Colors[colorScheme].border,
          opacity: isDragging ? 0.6 : 1,
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...(panResponder.current?.panHandlers || {})}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.checkbox} 
          onPress={toggleTaskCompletion}
        >
          <IconSymbol 
            name={task.completed ? "checkmark.circle.fill" : "circle"} 
            size={20} 
            color={task.completed ? Colors[colorScheme].tint : Colors[colorScheme].tabIconDefault} 
          />
        </TouchableOpacity>
        <Text 
          style={[
            styles.title, 
            { 
              color: Colors[colorScheme].text,
              textDecorationLine: task.completed ? 'line-through' : 'none',
              fontSize: getTitleFontSize(),
            }
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
      </View>

      {task.description ? (
        <Text 
          style={[
            styles.description, 
            { 
              color: Colors[colorScheme].tabIconDefault,
              fontSize: getDescriptionFontSize(),
            }
          ]}
          numberOfLines={2}
        >
          {task.description}
        </Text>
      ) : null}

      <View style={styles.footer}>
        {task.dueDate ? (
          <View style={styles.dueDate}>
            <IconSymbol 
              name="calendar" 
              size={14} 
              color={getDueDateColor()} 
            />
            <Text 
              style={[
                styles.dueDateText, 
                { 
                  color: getDueDateColor(),
                  fontSize: getDescriptionFontSize(),
                  fontWeight: isOverdue() || formatDate(task.dueDate) === 'Today' ? '600' : 'normal',
                }
              ]}
            >
              {formatDate(task.dueDate)}
            </Text>
          </View>
        ) : null}

        <View style={styles.priority}>
          <View 
            style={[
              styles.priorityIndicator, 
              { backgroundColor: getPriorityColor() }
            ]} 
          />
          <Text 
            style={[
              styles.priorityText, 
              { 
                color: Colors[colorScheme].tabIconDefault,
                fontSize: getDescriptionFontSize(),
              }
            ]}
          >
            {task.priority || 'normal'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleEditTask}
          >
            <IconSymbol name="pencil" size={16} color={Colors[colorScheme].tabIconDefault} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleDeleteTask}
          >
            <IconSymbol name="trash" size={16} color={Colors[colorScheme].tabIconDefault} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 8,
    marginTop: 2,
  },
  title: {
    flex: 1,
    fontWeight: '500',
  },
  description: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    marginLeft: 4,
  },
  priority: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  priorityText: {
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default TaskCard;