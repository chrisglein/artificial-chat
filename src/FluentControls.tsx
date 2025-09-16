import React, { useState } from 'react';
import {
  Text,
  PlatformColor,
  Pressable,
  Linking,
} from 'react-native';
// import {
//   ButtonV1 as Button,
//   CheckboxV1 as Checkbox,
//   Link,
// } from '@fluentui/react-native';

type FluentButtonProps = {
  title?: string;
  appearance?: 'primary' | 'subtle' | string;
  accessibilityLabel?: string;
  icon?: {
    fontSource?: {
      fontFamily?: string;
      codepoint?: number;
      fontSize?: number;
    };
  };
  iconOnly?: boolean;
  tooltip?: string;
  onClick?: () => void;
  onPress?: () => void;
  enabled?: boolean;
  children?: React.ReactNode;
}

const FluentButton = (props: FluentButtonProps) => {
  const handlePress = () => {
    if (props.onClick) {
      props.onClick();
    }
    if (props.onPress) {
      props.onPress();
    }
  };

  const renderIcon = () => {
    if (!props.icon?.fontSource) {
      return null;
    }
    
    const { fontFamily = 'Segoe MDL2 Assets', codepoint, fontSize = 16 } = props.icon.fontSource;
    const iconChar = codepoint ? String.fromCharCode(codepoint) : '';
    
    return (
      <Text style={{
        fontFamily,
        fontSize,
        color: props.appearance === 'primary' ? PlatformColor("TextOnAccentFillColorPrimary") : PlatformColor("TextControlForeground"),
        marginRight: props.iconOnly ? 0 : 4,
      }}>
        {iconChar}
      </Text>
    );
  };

  const renderContent = () => {
    const icon = renderIcon();
    const text = props.title || props.children;
    
    if (props.iconOnly) {
      return icon;
    }
    
    return (
      <>
        {icon}
        {text && (
          <Text style={{
            color: props.appearance === 'primary' ? PlatformColor("TextOnAccentFillColorPrimary") : PlatformColor("TextControlForeground"),
            textAlign: 'center',
          }}>
            {text}
          </Text>
        )}
      </>
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={props.enabled === false}
      accessibilityLabel={props.accessibilityLabel}
      accessibilityRole="button"
      style={({ pressed }) => ({
        padding: 8,
        backgroundColor: props.appearance === 'primary' ? PlatformColor("AccentFillColorDefault") : PlatformColor("ControlFillColorDefault"),
        borderColor: PlatformColor("ControlStrokeColorDefault"),
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      })}>
      {renderContent()}
    </Pressable>
  );
};

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (event: any, checked: boolean) => void;
  size?: 'large' | string;
}

const FluentCheckbox = (props: CheckboxProps) => {
  const [checked, setChecked] = useState(props.checked);
  
  const handlePress = () => {
    const newValue = !checked;
    setChecked(newValue);
    props.onChange(null, newValue);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        opacity: pressed ? 0.8 : 1,
      })}>
      <Text style={{ fontSize: 18, marginRight: 8 }}>
        {checked ? '☑' : '☐'}
      </Text>
      <Text>{props.label}</Text>
    </Pressable>
  );
};

type LinkProps = {
  content: string;
  url: string;
}

const Link = (props: LinkProps) => {
  const handlePress = () => {
    Linking.openURL(props.url).catch(err => {
      console.error('Failed to open URL:', err);
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="link"
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}>
      <Text style={{
        color: '#0078d4',
        textDecorationLine: 'underline',
      }}>
        {props.content}
      </Text>
    </Pressable>
  );
};

export { FluentButton, FluentCheckbox, Link };
