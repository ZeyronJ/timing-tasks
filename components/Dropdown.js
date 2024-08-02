import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const Dropdown = ({
  selectedValue,
  onValueChange,
  items,
  enabled,
  buttonBackgroundColor = 'white',
  buttonTextColor = 'black',
  borderButtonColor = 'gray',
  dropdownBorderColor = 'gray',
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (itemValue) => {
    onValueChange(itemValue);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => enabled && setDropdownVisible(!dropdownVisible)}
        style={[
          styles.button,
          {
            backgroundColor: buttonBackgroundColor,
            borderColor: borderButtonColor,
          },
        ]}
        activeOpacity={enabled ? 0.6 : 1}
      >
        <Text style={{ color: buttonTextColor }}>
          {items.find((item) => item.value === selectedValue)?.label ||
            'Selecciona una opción'}
          {'\u00A0'}
          {'\u00A0'}
          <AntDesign name='caretdown' size={16} color={buttonTextColor} />
        </Text>
      </TouchableOpacity>
      {dropdownVisible && (
        <View
          style={[
            styles.dropdownContainer,
            {
              backgroundColor: buttonBackgroundColor,
            },
          ]}
        >
          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item.value)}
                style={[
                  styles.dropdownItem,
                  { borderColor: dropdownBorderColor },
                ]}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    {
                      color: buttonTextColor,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    position: 'relative', // Needed for positioning dropdown
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    width: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    zIndex: 1, // Ensure dropdown is on top
  },
  dropdownItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    textAlign: 'center',
  },
});
