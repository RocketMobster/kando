import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useBoard, Task } from '@/context/BoardContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DatePicker } from '@/components/ui/DatePicker';

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  task?: Task | null;
  boardId: string;
  columnId: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onClose, task, boardId, columnId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState('normal');
  const { addTask, updateTask } = useBoard();
  const colorScheme = useColorScheme();
  const { layoutSize } = useResponsiveLayout();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      // Convert string date to Date object if it exists
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setPriority(task.priority || 'normal');
    } else {
      resetForm();
    }
  }, [task, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setPriority('normal');
  };

  const handleSubmit = () => {
    if (title.trim() === '') {
      return;
    }

    if (task) {
      // Update existing task
      updateTask(boardId, columnId, {
        ...task,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? dueDate.toISOString() : null,
        priority,
      });
    } else {
      // Add new task
      addTask(boardId, columnId, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? dueDate.toISOString() : null,
        priority,
        completed: false,
      });
    }

    resetForm();
    onClose();
  };

  // Get form width based on screen size
  const getFormWidth = () => {
    switch (layoutSize) {
      case 'small':
        return '90%';
      case 'medium':
        return '70%';
      case 'large':
        return '50%';
      default:
        return '80%';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              <View 
                style={[
                  styles.container, 
                  { 
                    backgroundColor: Colors[colorScheme].background,
                    width: getFormWidth(),
                  }
                ]}
              >
                <View style={styles.header}>
                  <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
                    {task ? 'Edit Task' : 'Add Task'}
                  </Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <IconSymbol name="xmark" size={20} color={Colors[colorScheme].tabIconDefault} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.formContainer}>
                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Title *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        { 
                          color: Colors[colorScheme].text,
                          backgroundColor: Colors[colorScheme].background,
                          borderColor: Colors[colorScheme].border
                        }
                      ]}
                      placeholder="Task title"
                      placeholderTextColor={Colors[colorScheme].tabIconDefault}
                      value={title}
                      onChangeText={setTitle}
                      autoFocus
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Description</Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.textArea,
                        { 
                          color: Colors[colorScheme].text,
                          backgroundColor: Colors[colorScheme].background,
                          borderColor: Colors[colorScheme].border
                        }
                      ]}
                      placeholder="Task description"
                      placeholderTextColor={Colors[colorScheme].tabIconDefault}
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Due Date</Text>
                    <DatePicker
                      value={dueDate}
                      onChange={setDueDate}
                      placeholder="Select a due date"
                      containerStyle={{ marginBottom: 0 }}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Priority</Text>
                    <View style={styles.priorityContainer}>
                      {['low', 'normal', 'medium', 'high'].map((p) => (
                        <TouchableOpacity
                          key={p}
                          style={[
                            styles.priorityButton,
                            priority === p && styles.priorityButtonActive,
                            priority === p && { backgroundColor: Colors[colorScheme].tint + '20' },
                          ]}
                          onPress={() => setPriority(p)}
                        >
                          <View 
                            style={[
                              styles.priorityIndicator, 
                              { 
                                backgroundColor: getPriorityColor(p),
                                borderColor: priority === p ? Colors[colorScheme].tint : 'transparent',
                              }
                            ]} 
                          />
                          <Text 
                            style={[
                              styles.priorityText,
                              { 
                                color: priority === p ? Colors[colorScheme].tint : Colors[colorScheme].text,
                                fontWeight: priority === p ? '600' : 'normal',
                              }
                            ]}
                          >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.footer}>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={onClose}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.button, 
                      styles.submitButton,
                      { backgroundColor: Colors[colorScheme].tint },
                      title.trim() === '' && styles.disabledButton,
                    ]} 
                    onPress={handleSubmit}
                    disabled={title.trim() === ''}
                  >
                    <Text style={[styles.buttonText, styles.submitButtonText]}>
                      {task ? 'Update' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    borderRadius: 12,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  priorityButtonActive: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  submitButtonText: {
    color: '#fff',
  },
});

export default TaskForm;