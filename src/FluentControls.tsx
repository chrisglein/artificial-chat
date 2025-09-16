import React, { useState } from 'react';
import {
  Text,
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

  return (
    <Pressable
      onPress={handlePress}
      disabled={props.enabled === false}
      accessibilityLabel={props.accessibilityLabel}
      accessibilityRole="button"
      style={({ pressed }) => ({
        padding: 8,
        backgroundColor: props.appearance === 'primary' ? '#0078d4' : 'transparent',
        borderRadius: 4,
        opacity: props.enabled === false ? 0.5 : pressed ? 0.8 : 1,
      })}>
      <Text style={{
        color: props.appearance === 'primary' ? 'white' : '#0078d4',
        textAlign: 'center',
      }}>
        {props.title || props.children}
      </Text>
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
