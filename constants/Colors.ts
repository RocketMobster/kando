/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F2F2F7',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    
    // Card and UI elements
    card: '#FFFFFF',
    border: '#C6C6C8',
    secondaryText: '#8E8E93',
    
    // Status colors
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    
    // Task priority colors
    priority: {
      high: '#FF3B30',
      medium: '#FF9500',
      low: '#34C759',
    },
    
    // Kanban column colors (for visual distinction)
    kanban: {
      todo: '#E9F0FF',
      inProgress: '#FFF9E9',
      done: '#E9FFF1',
    },
  },
  dark: {
    text: '#ECEDEE',
    background: '#1C1C1E',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    
    // Card and UI elements
    card: '#2C2C2E',
    border: '#38383A',
    secondaryText: '#8E8E93',
    
    // Status colors
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    
    // Task priority colors
    priority: {
      high: '#FF453A',
      medium: '#FF9F0A',
      low: '#30D158',
    },
    
    // Kanban column colors (for visual distinction)
    kanban: {
      todo: '#1C2951',
      inProgress: '#3D3415',
      done: '#1C3D24',
    },
  },
};

// Helper function to get the appropriate color based on the color scheme
export function getColor(colorKey: string, colorScheme: 'light' | 'dark' = 'light'): string {
  // Split the key by dots to access nested properties
  const keys = colorKey.split('.');
  
  // Start with the Colors object for the current scheme
  let color: any = Colors[colorScheme];
  
  // Navigate through the nested properties
  for (const key of keys) {
    if (color && color[key]) {
      color = color[key];
    } else {
      // Return a fallback color if the key doesn't exist
      return colorScheme === 'dark' ? '#FFFFFF' : '#000000';
    }
  }
  
  // Return the color or a fallback
  return typeof color === 'string' ? color : (colorScheme === 'dark' ? '#FFFFFF' : '#000000');
}
