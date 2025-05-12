import { styled } from 'nativewind';
import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const StyledText = styled(Text);

interface ThemedTextProps extends TextProps {
  light?: string;
  dark?: string;
}

const ThemedText: React.FC<ThemedTextProps> = ({ 
  style, 
  light = 'text-text-light',
  dark = 'text-text-dark',
  children,
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Text 
      style={[
        { color: isDarkMode ? '#E0E0E0' : '#333333' },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default ThemedText; 