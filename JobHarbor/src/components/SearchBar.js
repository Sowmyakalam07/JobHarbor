import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

const SearchBar = ({ value, onChangeText, placeholder, onSubmit }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Searchbar
        placeholder={placeholder || "Search..."}
        onChangeText={onChangeText}
        value={value}
        style={[styles.searchBar, { backgroundColor: colors.background }]}
        iconColor={colors.primary}
        inputStyle={{ color: colors.text }}
        placeholderTextColor={colors.placeholder}
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 8,
  },
});

export default SearchBar;
