import React, { useState } from 'react';
import {
  Text,
  PlatformColor,
  Pressable,
  Linking,
} from 'react-native';
import { StylesContext } from './Styles';
// import {
//   ButtonV1 as Button,
//   CheckboxV1 as Checkbox,
//   Link,
// } from '@fluentui/react-native';

type FluentButtonProps = {
  title?: string;
  appearance?: 'primary' | 'subtle' | 'icon' | string;
  accessibilityLabel?: string;
  icon?: {
    fontSource?: {
      fontFamily?: string;
      codepoint?: number;
      fontSize?: number;
      color?: string;
    };
  };
  iconOnly?: boolean;
  tooltip?: string;
  onClick?: () => void;
  enabled?: boolean;
  children?: React.ReactNode;
}

const baseButtonStyle = {
  paddingHorizontal: 4,
  paddingVertical: 4,
  borderWidth: 1,
  borderRadius: 4,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};

const getButtonStyle = (appearance: string | undefined, hovered: boolean, pressed: boolean) => {
  switch (appearance) {
    case 'primary':
      return {
        minWidth: 140,
        backgroundColor: (hovered || pressed)
          ? PlatformColor('AccentFillColorSecondary')
          : PlatformColor('AccentFillColorDefault'),
        borderColor: (hovered || pressed)
          ? PlatformColor('ControlStrokeColorSecondary')
          : PlatformColor('ControlStrokeColorDefault'),
      };
    case 'subtle':
      return {
        backgroundColor: (hovered || pressed)
          ? PlatformColor('SubtleFillColorSecondary')
          : 'transparent',
        borderColor: (hovered || pressed)
          ? PlatformColor('ControlStrokeColorDefault')
          : 'transparent',
      };
    case 'icon':
      return {
        minWidth: 44,
        backgroundColor: (hovered || pressed)
          ? PlatformColor('ControlFillColorSecondary')
          : PlatformColor('ControlFillColorDefault'),
        borderColor: (hovered || pressed)
          ? PlatformColor('ControlStrokeColorSecondary')
          : PlatformColor('ControlStrokeColorDefault'),
      };
    default:
      return {
        backgroundColor: (hovered || pressed)
          ? PlatformColor('ControlFillColorSecondary')
          : PlatformColor('ControlFillColorDefault'),
        borderColor: (hovered || pressed)
          ? PlatformColor('ControlStrokeColorSecondary')
          : PlatformColor('ControlStrokeColorDefault'),
      };
  }
};

const baseTextStyle = {
  textAlign: 'center',
  color: PlatformColor('TextControlForeground'),
};

const getTextStyle = (appearance: string | undefined, pressed: boolean) => {
  switch (appearance) {
    case 'primary':
      return {
        opacity: pressed ? 0.75 : 1,
        color: PlatformColor('TextOnAccentFillColorPrimary'),
      };
    case 'subtle':
      return {
        color: pressed
          ? PlatformColor('TextFillColorPrimary')
          : PlatformColor('TextControlForeground'),
      };
    default:
      return {};
  }
};

const baseIconStyle = {
  fontFamily: 'Segoe MDL2 Assets',
  fontSize: 16,
  color: PlatformColor('TextControlForeground'),
};

const getIconStyle = (appearance: string | undefined, pressed: boolean) => {
  switch (appearance) {
    case 'primary':
      return {
        color: PlatformColor('TextOnAccentFillColorPrimary'),
      };
    case 'subtle':
      return {
        color: pressed
          ? PlatformColor('TextFillColorPrimary')
          : PlatformColor('TextControlForeground'),
      };
    default:
      return {};
  }
};

const FluentButton = (props: FluentButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (props.onClick) {
      props.onClick();
    }
  };

  const text = props.title || props.children as string;

  const renderContent = () => {
    const customColor = props.icon?.fontSource?.color;
    
    const customStyle = {
      fontFamily: props.icon?.fontSource?.fontFamily,
      fontSize: props.icon?.fontSource?.fontSize,
      ...(customColor ? { color: customColor } : {}),
      marginRight: props.iconOnly ? 0 : 4,
    };

    const icon = props.icon?.fontSource ? (
      <Text accessible={false} style={[
        baseIconStyle,
        getIconStyle(
          props.appearance,
          isPressed,
        ),
        customStyle,
      ]}>
        {props.icon.fontSource.codepoint ? String.fromCharCode(props.icon.fontSource.codepoint) : ''}
      </Text>
    ) : null;

    if (props.iconOnly) {
      return icon;
    }

    return (
      <>
        {icon}
        {text && (
          <Text accessible={false} style={[baseTextStyle, getTextStyle(props.appearance, isPressed)]}>
            {text}
          </Text>
        )}
      </>
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      disabled={props.enabled === false}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? text}
      onAccessibilityTap={handlePress}
      tooltip={props.tooltip}
      style={[
        baseButtonStyle,
        getButtonStyle(props.appearance, isHovered, isPressed),
      ]}>
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
  const styles = React.useContext(StylesContext);

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
      <Text style={[styles.text, { fontSize: 18, marginRight: 4, minWidth: 26 }]}>
        {checked ? '☑' : '☐'}
      </Text>
      <Text style={styles.text}>{props.label}</Text>
    </Pressable>
  );
};

type LinkProps = {
  content: string;
  url: string;
}

const Link = (props: LinkProps) => {
  const styles = React.useContext(StylesContext);

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
      <Text style={[styles.text, {
        color: '#0078d4',
        textDecorationLine: 'underline',
      }]}>
        {props.content}
      </Text>
    </Pressable>
  );
};

export { FluentButton, FluentCheckbox, Link };
