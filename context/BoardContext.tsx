import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

// Define types for our data structure
export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate?: string | null; // ISO string format or null
  priority: 'low' | 'normal' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export type Board = {
  id: string;
  title: string;
  columns: Column[];
  createdAt: string;
};

type BoardContextType = {
  boards: Board[];
  currentBoard: Board | null;
  setCurrentBoard: (board: Board | null) => void;
  addBoard: (title: string) => void;
  updateBoard: (board: Board) => void;
  deleteBoard: (boardId: string) => void;
  addColumn: (boardId: string, title: string) => void;
  updateColumn: (boardId: string, column: Column) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addTask: (boardId: string, columnId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (boardId: string, columnId: string, task: Task) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  moveTask: (boardId: string, sourceColumnId: string, destinationColumnId: string, taskId: string) => void;
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);

  // Load boards from AsyncStorage on component mount
  useEffect(() => {
    const loadBoards = async () => {
      try {
        const storedBoards = await AsyncStorage.getItem('boards');
        if (storedBoards) {
          const parsedBoards = JSON.parse(storedBoards);
          setBoards(parsedBoards);
          
          // Set the first board as current if available and no current board is set
          if (parsedBoards.length > 0 && !currentBoard) {
            setCurrentBoard(parsedBoards[0]);
          }
        }
      } catch (error) {
        console.error('Error loading boards:', error);
      }
    };

    loadBoards();
  }, []);

  // Save boards to AsyncStorage whenever they change
  useEffect(() => {
    const saveBoards = async () => {
      try {
        await AsyncStorage.setItem('boards', JSON.stringify(boards));
      } catch (error) {
        console.error('Error saving boards:', error);
      }
    };

    saveBoards();
  }, [boards]);

  // Board operations
  const addBoard = (title: string) => {
    const newBoard: Board = {
      id: uuid.v4().toString(),
      title,
      columns: [
        {
          id: uuid.v4().toString(),
          title: 'To Do',
          tasks: [],
        },
        {
          id: uuid.v4().toString(),
          title: 'In Progress',
          tasks: [],
        },
        {
          id: uuid.v4().toString(),
          title: 'Done',
          tasks: [],
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setBoards([...boards, newBoard]);
    setCurrentBoard(newBoard);
  };

  const updateBoard = (updatedBoard: Board) => {
    setBoards(boards.map(board => (board.id === updatedBoard.id ? updatedBoard : board)));
    if (currentBoard?.id === updatedBoard.id) {
      setCurrentBoard(updatedBoard);
    }
  };

  const deleteBoard = (boardId: string) => {
    setBoards(boards.filter(board => board.id !== boardId));
    if (currentBoard?.id === boardId) {
      setCurrentBoard(boards.length > 0 ? boards[0] : null);
    }
  };

  // Column operations
  const addColumn = (boardId: string, title: string) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          columns: [
            ...board.columns,
            {
              id: uuid.v4().toString(),
              title,
              tasks: [],
            },
          ],
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    if (currentBoard?.id === boardId) {
      setCurrentBoard(updatedBoards.find(board => board.id === boardId) || null);
    }
  };

  const updateColumn = (boardId: string, updatedColumn: Column) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          columns: board.columns.map(column =>
            column.id === updatedColumn.id ? updatedColumn : column
          ),
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    if (currentBoard?.id === boardId) {
      setCurrentBoard(updatedBoards.find(board => board.id === boardId) || null);
    }
  };

  const deleteColumn = (boardId: string, columnId: string) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          columns: board.columns.filter(column => column.id !== columnId),
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    if (currentBoard?.id === boardId) {
      setCurrentBoard(updatedBoards.find(board => board.id === boardId) || null);
    }
  };

  // Task operations
  const addTask = (boardId: string, columnId: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuid.v4().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          columns: board.columns.map(column => {
            if (column.id === columnId) {
              return {
                ...column,
                tasks: [...column.tasks, newTask],
              };
            }
            return column;
          }),
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    if (currentBoard?.id === boardId) {
      setCurrentBoard(updatedBoards.find(board => board.id === boardId) || null);
    }
  };

  const updateTask = (boardId: string, columnId: string, updatedTask: Task) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          columns: board.columns.map(column => {
            if (column.id === columnId) {
              return {
                ...column,
                tasks: column.tasks.map(task =>
                  task.id === updatedTask.id ? updatedTask : task
                ),
              };
            }
            return column;
          }),
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    if (currentBoard?.id === boardId) {
      setCurrentBoard(updatedBoards.find(board => board.id === boardId) || null);
    }
  };

  const deleteTask = (boardId: string, columnId: string, taskId: string) => {
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          columns: board.columns.map(column => {
            if (column.id === columnId) {
              return {
                ...column,
                tasks: column.tasks.filter(task => task.id !== taskId),
              };
            }
            return column;
          }),
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    if (currentBoard?.id === boardId) {
      setCurrentBoard(updatedBoards.find(board => board.id === boardId) || null);
    }
  };

  const moveTask = (boardId: string, sourceColumnId: string, destinationColumnId: string, taskId: string) => {
    // Find the task in the source column
    let taskToMove: Task | undefined;
    let updatedBoards = [...boards];

    // Find the board
    const boardIndex = updatedBoards.findIndex(board => board.id === boardId);
    if (boardIndex === -1) return;

    // Find the source column
    const sourceColumnIndex = updatedBoards[boardIndex].columns.findIndex(
      column => column.id === sourceColumnId
    );
    if (sourceColumnIndex === -1) return;

    // Find the task
    const taskIndex = updatedBoards[boardIndex].columns[sourceColumnIndex].tasks.findIndex(
      task => task.id === taskId
    );
    if (taskIndex === -1) return;

    // Get the task and remove it from the source column
    taskToMove = updatedBoards[boardIndex].columns[sourceColumnIndex].tasks[taskIndex];
    updatedBoards[boardIndex].columns[sourceColumnIndex].tasks.splice(taskIndex, 1);

    // Find the destination column and add the task
    const destColumnIndex = updatedBoards[boardIndex].columns.findIndex(
      column => column.id === destinationColumnId
    );
    if (destColumnIndex === -1) return;

    updatedBoards[boardIndex].columns[destColumnIndex].tasks.push(taskToMove);

    setBoards(updatedBoards);
    if (currentBoard?.id === boardId) {
      setCurrentBoard(updatedBoards[boardIndex]);
    }
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        currentBoard,
        setCurrentBoard,
        addBoard,
        updateBoard,
        deleteBoard,
        addColumn,
        updateColumn,
        deleteColumn,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
      }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};