import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import ThemedText from './ThemedText';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>
        {title}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default Header; 