import React, { PropsWithChildren } from 'react';
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

interface PickerState {
  isOpen: boolean;
  selectedValue: string;
}

class Picker extends React.Component<PickerProps, PickerState> {
  constructor(props: PickerProps) {
    super(props);
    this.state = {
      isOpen: false,
      selectedValue: this.props.selectedValue,
    };
  }
  
  static Item(props: PickerItemProps) {
    return (
      <Text style={styles.pickerItemText}>{props.label}</Text>
    );
  }

  componentDidUpdate(prevProps: PickerProps) {
    if (prevProps.selectedValue !== this.props.selectedValue) {
      this.setState({ selectedValue: this.props.selectedValue });
    }
  }

  private openDropdown = () => {
    this.setState({ isOpen: true });
  };

  private closeDropdown = () => {
    this.setState({ isOpen: false });
  };

  private selectItem = (value: string) => {
    this.setState({ selectedValue: value });
    this.props.onValueChange(value);
    this.closeDropdown();
  };

  private findSelectedChild = (children: Iterable<React.ReactNode>) => {
    for (let child of children) {
      let childElement = child as React.ReactElement<any>;
      if (childElement?.props?.value === this.state.selectedValue) {
        return childElement?.props?.label || childElement?.props?.value;
      }
    }
    return '';
  };

  render() {
    let children = this.props.children as React.ReactNode;
    const selectedLabel = this.findSelectedChild(children as any);
    
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
            this.state.isOpen && styles.pickerButtonOpen,
          ]}
          onPress={this.openDropdown}
          accessibilityLabel={this.props.accessibilityLabel}
          accessibilityRole="combobox"
          accessibilityState={{
            expanded: this.state.isOpen,
            selected: false,
          }}
          accessibilityValue={{ text: selectedLabel || 'No selection' }}
          accessibilityHint="Double tap to open dropdown menu">
          <Text style={styles.pickerButtonText} numberOfLines={1}>
            {selectedLabel || 'Select an option...'}
          </Text>
          <Text style={styles.dropdownArrow} accessibilityLabel="dropdown arrow">
            {this.state.isOpen ? '▲' : '▼'}
          </Text>
        </Pressable>

        <Modal
          visible={this.state.isOpen}
          onRequestClose={this.closeDropdown}>
          <View style={{ height: calculatedHeight }}>
            <Pressable onPress={() => {}}>
              <View
                style={styles.dropdown}
                accessibilityRole="menu"
                accessibilityLabel={`${this.props.accessibilityLabel} options`}>
                  {validChildren.map((child: any) => (
                    <PickerListItem
                      key={child.props.value}
                      child={child}
                      selectedValue={this.state.selectedValue}
                      onSelectItem={this.selectItem}
                    />
                  ))}
              </View>
            </Pressable>
          </View>
        </Modal>
      </View>
      );
    }
  }

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