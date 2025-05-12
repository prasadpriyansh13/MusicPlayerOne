import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemedViewProps extends ViewProps {
  light?: string;
  dark?: string;
}

const ThemedView: React.FC<ThemedViewProps> = ({ 
  style, 
  light = 'bg-background-light',
  dark = 'bg-background-dark',
  children,
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  const themeClass = isDarkMode ? dark : light;
  
  return (
    <View 
      style={[
        { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default ThemedView; 