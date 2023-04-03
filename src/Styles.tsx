import React from 'react';
import type {
  StyleProp,
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native';
import { PlatformColor } from 'react-native';
import { StyleSheet } from 'react-native';
import { ThemeReference } from '@fluentui-react-native/theme';
import { createDefaultTheme } from '@fluentui-react-native/default-theme';
import { globalTokens } from '@fluentui-react-native/theme-tokens';

const StylesContext = React.createContext<{
  appContent: StyleProp<ViewStyle>;
  popupBackground: StyleProp<ViewStyle>;
  sectionContainer: StyleProp<ViewStyle>;
  humanSection: StyleProp<ViewStyle>;
  AiSection: StyleProp<ViewStyle>;
  sectionTitle: StyleProp<TextStyle>;
  highlight: StyleProp<ViewStyle>;
  horizontalContainer: StyleProp<ViewStyle>;
  dalleImage: StyleProp<ImageStyle>;
  inlineCard: StyleProp<ViewStyle>;
  dialogTitle: StyleProp<TextStyle>;
  dialogSectionsContainer: StyleProp<ViewStyle>;
  dialogSection: StyleProp<ViewStyle>;
  dialogSectionHeader: StyleProp<TextStyle>;
  dialogBackground: StyleProp<ViewStyle>;
  dialogButtons: StyleProp<ViewStyle>;
  codeBlockTitle: StyleProp<TextStyle>;
  codeBlockTitleText: StyleProp<TextStyle>;
  hyperlinkIdle: StyleProp<TextStyle>;
  hyperlinkPressing: StyleProp<TextStyle>;
  hyperlinkHovering: StyleProp<TextStyle>;
}>({});

const CreateStyles = (isDarkMode: boolean) => {
  return StyleSheet.create({
    appContent: {
      backgroundColor: isDarkMode ? '#1F1F1F' : '#F5F5F5',
      justifyContent: 'space-between',
      height: '100%',
    },
    popupBackground: {
      backgroundColor: isDarkMode ? 'white' : 'black',
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.3,
    },
    sectionContainer: {
      marginHorizontal: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    humanSection: {
      backgroundColor: isDarkMode ? '#2F2F4A' : '#E8EBFA',
      marginRight: 64,
    },
    AiSection: {
      backgroundColor: isDarkMode ? '#292929' : '#FFFFFF',
      marginLeft: 64,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
    },
    highlight: {
      fontWeight: '700',
    },
    horizontalContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 12,
    },
    dalleImage: {
      width: 150,
      height: 150,
    },
    inlineCard: {
      borderColor: 'gray',
      borderWidth: 2,
      borderRadius: 8,
      padding: 8,
    },
    dialogTitle: {
      fontSize: 20,
    },
    dialogSectionsContainer: {
      gap: 12,
    },
    dialogSection: {
      backgroundColor: isDarkMode ? '#1F1F1F' : '#F5F5F5',
      borderRadius: 8,
      padding: 12,
    },
    dialogSectionHeader: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    dialogBackground: {
      backgroundColor: isDarkMode ? '#292929' : '#FFFFFF',
      padding: 12,
      borderRadius: 8,
      minWidth: 300
    },
    dialogButtons: {
      marginTop: 12,
      alignSelf: 'flex-end',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8,
    },
    codeBlockTitle: {
      backgroundColor: isDarkMode ? 'white' : '#444',
    },
    codeBlockTitleText: {
      color: isDarkMode ? 'black' : 'white',
    },
    hyperlinkIdle: {
      color: PlatformColor("HyperlinkButtonForeground"),
      textDecorationLine: 'underline',
    },
    hyperlinkPressing: {
      color: PlatformColor("HyperlinkButtonForegroundPressed"),
    },
    hyperlinkHovering: {
      color: PlatformColor("HyperlinkButtonForegroundPointerOver"),
      textDecorationLine: 'underline',
    },
  });
}

let windowsThemeReference: ThemeReference;
  
function createWindowsTheme(): ThemeReference {
  windowsThemeReference = new ThemeReference(createDefaultTheme(), (t) => {
    return {
      components: {
        Checkbox: {
          large: {
            borderRadius: globalTokens.corner.radius40,
            checkboxBorderRadius: globalTokens.corner.radius40,
            checkmarkSize: 12,
          },
          checkboxBackgroundColor: PlatformColor('ControlAltFillColorSecondaryBrush'),
          hovered: {
            checkboxBackgroundColor: PlatformColor('ControlAltFillColorTertiaryBrush'),
          },
          pressed: {
            checkboxBackgroundColor: PlatformColor('ControlAltFillColorQuarternaryBrush'),
          }
        }
      },
      colors: {
        link: PlatformColor('AccentTextFillColorPrimaryBrush'),
        linkHovered: PlatformColor('AccentTextFillColorSecondaryBrush'),
        linkPressed: PlatformColor('AccentTextFillColorTertiaryBrush'),

        neutralStrokeAccessible: PlatformColor('ControlStrongStrokeColorDefaultBrush'), // border for unchecked checkbox (idle)
        neutralStrokeAccessibleHover: PlatformColor('ControlStrongStrokeColorDefaultBrush'), // border for unchecked checkbox (hover)
        neutralStrokeAccessiblePressed: PlatformColor('ControlStrongStrokeColorDisabledBrush'), // border for unchecked checkbox (pressed)
        neutralStrokeDisabled: PlatformColor('ControlStrongStrokeColorDisabledBrush'), // border for unchecked checkbox (disabled)

        neutralForeground1: PlatformColor('TextFillColorPrimaryBrush'), // foreground for unchecked checkbox (pressed)
        neutralForeground1Hover: PlatformColor('TextFillColorPrimaryBrush'),
        neutralForeground1Pressed: PlatformColor('TextFillColorPrimaryBrush'),
        neutralForegroundDisabled: PlatformColor('TextFillColorDisabledBrush'), // check color for checked/unchecked checkbox (disabled)
        neutralForeground2: PlatformColor('TextFillColorPrimaryBrush'), // foreground for unchecked checkbox (hover)
        neutralForeground3: PlatformColor('TextFillColorPrimaryBrush'), // foreground for unchecked checkbox (idle)

        // Used for Button
        neutralForegroundOnBrand: PlatformColor('TextOnAccentFillColorPrimaryBrush'), // check color for checked checkbox (hover/pressed/idle)

        // Used for Button
        neutralBackground1: PlatformColor('ControlFillColorDefaultBrush'), // fill for unchecked checkbox (idle/hover/pressed)
        neutralBackground1Hover: PlatformColor('ControlFillColorSecondaryBrush'),
        neutralBackground1Pressed: PlatformColor('ControlFillColorTertiaryBrush'),
        neutralBackgroundDisabled: PlatformColor('ControlFillColorDisabledBrush'), // fill for unchecked checkbox (disabled)

        // Used for Button
        brandBackground: PlatformColor('AccentFillColorDefaultBrush'),
        brandBackgroundHover: PlatformColor('AccentFillColorSecondaryBrush'),
        brandBackgroundPressed: PlatformColor('AccentFillColorTertiaryBrush'),
        brandBackgroundDisabled: PlatformColor('AccentFillColorDisabledBrush'),

        compoundBrandBackground1: PlatformColor('AccentFillColorDefaultBrush'), // fill and border for checked checkbox (idle)
        compoundBrandBackground1Pressed: PlatformColor('AccentFillColorTertiaryBrush'), // fill and border for checked checkbox (pressed)
        compoundBrandBackground1Hover: PlatformColor('AccentFillColorSecondaryBrush'), // fill and border for checked checkbox (hover)
      }
    }});

  return windowsThemeReference;
}

export { StylesContext, CreateStyles, createWindowsTheme };