import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, IconButton, useTheme } from 'react-native-paper';

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  buttonText, 
  onButtonPress,
  iconSize = 64
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <IconButton
        icon={icon}
        size={iconSize}
        color={colors.primary}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      {buttonText && onButtonPress && (
        <Button
          mode="contained"
          onPress={onButtonPress}
          style={styles.button}
        >
          {buttonText}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 16,
  },
});

export default EmptyState;
