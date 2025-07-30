// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  'house.fill': 'home',
  'sidebar.left': 'menu',
  'sidebar.right': 'menu_open',
  'chevron.right': 'chevron-right',
  
  // Common actions
  'plus': 'add',
  'plus.circle': 'add_circle_outline',
  'plus.circle.fill': 'add_circle',
  'minus': 'remove',
  'minus.circle': 'remove_circle_outline',
  'minus.circle.fill': 'remove_circle',
  'xmark': 'close',
  'xmark.circle': 'cancel',
  'xmark.circle.fill': 'cancel',
  'checkmark': 'check',
  'checkmark.circle': 'check_circle_outline',
  'checkmark.circle.fill': 'check_circle',
  'circle': 'radio_button_unchecked',
  'circle.fill': 'radio_button_checked',
  
  // Content
  'list.bullet': 'list',
  'list.bullet.rectangle': 'view_list',
  'rectangle.grid.1x2': 'dashboard',
  'calendar': 'calendar_today',
  'info.circle': 'info',
  'info': 'info',
  'paperplane.fill': 'send',
  
  // Edit
  'pencil': 'edit',
  'trash': 'delete',
  
  // Other
  'ellipsis': 'more_horiz',
  'gear': 'settings',
  'person.circle': 'account_circle',
  'person.circle.fill': 'account_circle',
  'arrow.up': 'arrow_upward',
  'arrow.down': 'arrow_downward',
  'arrow.left': 'arrow_back',
  'arrow.right': 'arrow_forward',
  'chevron.left.forwardslash.chevron.right': 'code',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Fallback to a similar icon if the mapping doesn't exist
  const iconName = MAPPING[name] || 'help_outline';
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
