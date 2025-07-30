import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Pressable,
} from 'react-native';
import { useBoard } from '@/context/BoardContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

const BoardList: React.FC = () => {
  const { boards, currentBoard, addBoard, updateBoard, deleteBoard, setCurrentBoard } = useBoard();
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [editingBoard, setEditingBoard] = useState<{ id: string; title: string } | null>(null);
  const colorScheme = useColorScheme();
  const { layoutSize, isSmallScreen } = useResponsiveLayout();

  const handleAddBoard = () => {
    if (newBoardTitle.trim() === '') {
      Alert.alert('Error', 'Board title cannot be empty');
      return;
    }

    const newBoard = addBoard(newBoardTitle.trim());
    setNewBoardTitle('');
    setIsAddingBoard(false);
    setCurrentBoard(newBoard.id);
  };

  const handleUpdateBoard = () => {
    if (!editingBoard) return;

    if (editingBoard.title.trim() === '') {
      Alert.alert('Error', 'Board title cannot be empty');
      return;
    }

    const board = boards.find(b => b.id === editingBoard.id);
    if (board) {
      updateBoard({
        ...board,
        title: editingBoard.title.trim(),
      });
    }

    setEditingBoard(null);
  };

  const handleDeleteBoard = (boardId: string) => {
    Alert.alert(
      'Delete Board',
      'Are you sure you want to delete this board? All columns and tasks in this board will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteBoard(boardId) 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Boards</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setIsAddingBoard(true)}
        >
          <IconSymbol name="plus.circle.fill" size={24} color={Colors[colorScheme].tint} />
        </TouchableOpacity>
      </View>

      {isAddingBoard ? (
        <View style={[styles.addBoardContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors[colorScheme].text,
                backgroundColor: Colors[colorScheme].background,
                borderColor: Colors[colorScheme].border
              }
            ]}
            placeholder="Board name"
            placeholderTextColor={Colors[colorScheme].tabIconDefault}
            value={newBoardTitle}
            onChangeText={setNewBoardTitle}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAddBoard}
          />
          <View style={styles.addBoardButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => {
                setIsAddingBoard(false);
                setNewBoardTitle('');
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleAddBoard}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <ScrollView style={styles.boardsContainer}>
        {boards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>
              No boards yet. Create your first board to get started.
            </Text>
          </View>
        ) : (
          boards.map((board) => (
            <Pressable
              key={board.id}
              style={[styles.boardItem, 
                currentBoard?.id === board.id && styles.activeBoardItem,
                { backgroundColor: currentBoard?.id === board.id ? 
                    Colors[colorScheme].tint + '20' : // 20% opacity
                    'transparent' }
              ]}
              onPress={() => setCurrentBoard(board.id)}
            >
              <View style={styles.boardItemContent}>
                <IconSymbol 
                  name="list.bullet.rectangle" 
                  size={20} 
                  color={currentBoard?.id === board.id ? 
                    Colors[colorScheme].tint : 
                    Colors[colorScheme].text} 
                />
                {editingBoard && editingBoard.id === board.id ? (
                  <TextInput
                    style={[
                      styles.boardTitleInput,
                      { color: Colors[colorScheme].text }
                    ]}
                    value={editingBoard.title}
                    onChangeText={(text) => setEditingBoard({ ...editingBoard, title: text })}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleUpdateBoard}
                    onBlur={handleUpdateBoard}
                  />
                ) : (
                  <Text 
                    style={[
                      styles.boardTitle, 
                      { 
                        color: currentBoard?.id === board.id ? 
                          Colors[colorScheme].tint : 
                          Colors[colorScheme].text 
                      }
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {board.title}
                  </Text>
                )}
              </View>
              <View style={styles.boardActions}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => setEditingBoard({ id: board.id, title: board.title })}
                >
                  <IconSymbol 
                    name="pencil" 
                    size={16} 
                    color={Colors[colorScheme].tabIconDefault} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleDeleteBoard(board.id)}
                >
                  <IconSymbol 
                    name="trash" 
                    size={16} 
                    color={Colors[colorScheme].tabIconDefault} 
                  />
                </TouchableOpacity>
              </View>
            </Pressable>
          ))
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 4,
  },
  boardsContainer: {
    flex: 1,
  },
  boardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  activeBoardItem: {
    borderLeftWidth: 3,
  },
  boardItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  boardTitle: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  boardTitleInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    padding: 0,
  },
  boardActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginRight: 4,
  },
  deleteButton: {
    padding: 8,
  },
  addBoardContainer: {
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
  addBoardButtons: {
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
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default BoardList;