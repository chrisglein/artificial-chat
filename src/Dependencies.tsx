import React, { PropsWithChildren, useState, useEffect } from 'react';
import {
  Pressable,
  Text,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
//import {Picker} from '@react-native-picker/picker';

type PickerItemProps = {
  label: string,
  value: string,
  key: string,
}

type PickerListItemProps = {
  child: React.ReactElement<any>;
  selectedValue: string;
  onSelectItem: (value: string) => void;
}

const PickerListItem: React.FC<PickerListItemProps> = ({ child, selectedValue, onSelectItem }) => {
  const { value, label } = child.props;
  const isSelected = selectedValue === value;
  const displayText = label || value || 'Unknown option';
  const accessibilityText = `${displayText} option`;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.pickerItem,
        isSelected && styles.pickerItemSelected,
        pressed && styles.pickerItemPressed,
      ]}
      onPress={() => onSelectItem(value)}
      accessibilityRole="menuitem"
      accessibilityLabel={accessibilityText}
      accessibilityState={{
        selected: isSelected,
      }}
      accessibilityHint="Double tap to select this option">
      {isSelected && (
        <Text style={styles.selectedIndicator} accessibilityLabel="selected">✓</Text>
      )}
      <Text style={[
        styles.pickerItemText,
        isSelected && styles.pickerItemTextSelected,
      ]}>
        {displayText}
      </Text>
    </Pressable>
  );
};

type PickerProps = PropsWithChildren<{
  selectedValue: string,
  onValueChange: (value: string) => void,
  accessibilityLabel: string,
  Item: (props: PickerItemProps) => React.ReactElement,
}>

// Static Item component for the Picker
const PickerItem = (props: PickerItemProps) => {
  return (
    <Text style={styles.pickerItemText}>{props.label}</Text>
  );
};

const Picker = (props: PickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(props.selectedValue);

  // Update selectedValue when props.selectedValue changes
  useEffect(() => {
    setSelectedValue(props.selectedValue);
  }, [props.selectedValue]);

  const openDropdown = () => {
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const selectItem = (value: string) => {
    setSelectedValue(value);
    props.onValueChange(value);
    closeDropdown();
  };

  const findSelectedChild = (children: Iterable<React.ReactNode>) => {
    for (let child of children) {
      let childElement = child as React.ReactElement<any>;
      if (childElement?.props?.value === selectedValue) {
        return childElement?.props?.label || childElement?.props?.value;
      }
    }
    return '';
  };

  let children = props.children as React.ReactNode;
  const selectedLabel = findSelectedChild(children as any);
  
  // Filter out invalid children before mapping
  const validChildren = Array.from(children as any).filter((child: any) =>
    child?.props && (child.props.value !== undefined || child.props.label !== undefined)
  );
  
  const itemHeight = 44; // minHeight from styles.pickerItem
  const calculatedHeight = Math.min(validChildren.length * itemHeight, 300); // Max height of 300

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.pickerButton,
          pressed && styles.pickerButtonPressed,
          isOpen && styles.pickerButtonOpen,
        ]}
        onPress={openDropdown}
        accessibilityLabel={props.accessibilityLabel}
        accessibilityRole="combobox"
        accessibilityState={{
          expanded: isOpen,
          selected: false,
        }}
        accessibilityValue={{ text: selectedLabel || 'No selection' }}
        accessibilityHint="Double tap to open dropdown menu">
        <Text style={styles.pickerButtonText} numberOfLines={1}>
          {selectedLabel || 'Select an option...'}
        </Text>
        <Text style={styles.dropdownArrow} accessibilityLabel="dropdown arrow">
          {isOpen ? '▲' : '▼'}
        </Text>
      </Pressable>

      <Modal
        visible={isOpen}
        onRequestClose={closeDropdown}>
        <View style={{ height: calculatedHeight }}>
          <Pressable onPress={() => {}}>
            <View
              style={styles.dropdown}
              accessibilityRole="menu"
              accessibilityLabel={`${props.accessibilityLabel} options`}>
                {validChildren.map((child: any) => (
                  <PickerListItem
                    key={child.props.value}
                    child={child}
                    selectedValue={selectedValue}
                    onSelectItem={selectItem}
                  />
                ))}
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

// Attach the Item component as a static property for compatibility
Picker.Item = PickerItem;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFFFF', // Match textBox background from Styles.tsx
    borderWidth: 1, // Match TextControlBorderThemeThickness
    borderBottomWidth: 2,
    borderColor: '#A3000000', // Match TextBoxBorderThemeBrush
    borderBottomColor: '#72000000', // Match ControlStrongStrokeColorDefault
    paddingLeft: 10, // Match TextControlThemePadding
    paddingTop: 6,
    paddingRight: 10,
    paddingBottom: 5,
    minHeight: 32, // Match TextControlThemeMinHeight
  },
  pickerButtonPressed: {
    backgroundColor: '#F0F0F0',
    borderColor: '#666666',
    borderBottomColor: '#555555',
  },
  pickerButtonOpen: {
    borderColor: '#0066CC',
    borderBottomColor: '#0066CC',
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    marginRight: 8,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666666',
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    minWidth: 200,
  },
  pickerItem: {
    paddingVertical: 12,
    minHeight: 44, // Better touch target size
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  pickerItemSelected: {
    backgroundColor: '#E8F4FD',
  },
  pickerItemPressed: {
    backgroundColor: '#D0D0D0',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  pickerItemTextSelected: {
    color: '#0066CC',
  },
  selectedIndicator: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export { Picker };