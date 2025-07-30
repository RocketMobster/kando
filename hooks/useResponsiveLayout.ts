import { useWindowDimensions } from 'react-native';

export type LayoutSize = 'small' | 'medium' | 'large';

export const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();

  // Define breakpoints for different screen sizes
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Determine the current layout size
  const layoutSize: LayoutSize = isSmallScreen 
    ? 'small' 
    : isMediumScreen 
    ? 'medium' 
    : 'large';

  // Calculate sidebar width based on screen size
  const sidebarWidth = isLargeScreen 
    ? '25%' 
    : isMediumScreen 
    ? '30%' 
    : '100%';

  // Calculate board width based on screen size
  const boardWidth = isLargeScreen 
    ? '75%' 
    : isMediumScreen 
    ? '70%' 
    : '100%';

  // Determine if we should use a horizontal or vertical layout
  const isHorizontalLayout = !isSmallScreen;

  return {
    layoutSize,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    sidebarWidth,
    boardWidth,
    isHorizontalLayout,
  };
};