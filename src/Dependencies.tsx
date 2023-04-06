import React, { PropsWithChildren } from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import Clipboard from '@react-native-clipboard/clipboard';
//import Markdown from 'react-native-markdown-display';
//import {Picker} from '@react-native-picker/picker';
//import {Popup} from 'react-native-windows';
//import SyntaxHighlighter from 'react-native-syntax-highlighter';
//import { vs2015 } from 'react-syntax-highlighter/styles/hljs';
//import VersionInfo from './NativeVersionInfo'

const AsyncStorage = {
  getItem: async (key: string) => {
    return null;
  },
  setItem: async (key: string, value: string) => {
  },
}

const Clipboard = {
  setString: (content: string) => void {
  }
}

function Markdown ({children}: {children: string}) {
  return (
    <Text>{children}</Text>
  );
}

type PickerItemProps = {
  label: string,
  value: string,
  key: string,
}
type PickerProps = PropsWithChildren<{
  selectedValue: string,
  onValueChange: (value: string) => void,
  accessibilityLabel: string,
  Item: (props: PickerItemProps) => JSX.Element,
}>
class Picker extends React.Component<PickerProps> {
  state = {
    isOpen: false,
    selectedValue: this.props.selectedValue,
  }
  
  static Item(props : PickerItemProps) {
    return (
      <Text key={props.key}>{props.value}</Text>
    )
  }

  render() {
    let children = this.props.children as React.ReactFragment;

    const findSelectedChild = (children: Iterable<React.ReactNode>) => {
      for (let child of children) {
        let childElement = child as React.ReactElement;
        if (childElement?.props?.value === this.state.selectedValue) {
          return child;
        }
      }
      return null;
    }

    let selectedChild = children ? 
      findSelectedChild(children) : 
      <View/>;
    return (
      <View>
        {this.state.isOpen ?
          Array.from(children).map((child: any) => {
            return (
              <Pressable
                key={child.key}
                onPress={() => {
                  this.setState({
                    isOpen: false,
                    selectedValue: child.props.value
                  });
                  this.props.onValueChange(child.props.value);
                }}>
                {child}
              </Pressable>
            );
          }) :
          <Pressable
            onPress={() => this.setState({isOpen: true})}>
            {selectedChild}
          </Pressable>
        }
      </View>
    );
  }
}

function Popup({isOpen, isLightDismissEnabled, onDismiss, children}: any) {
  return (
    <Pressable
      style={{position: 'absolute'}}
      onPress={() => {
        if (isLightDismissEnabled) {
          onDismiss();
        }
      }}>
      {isOpen && children}
    </Pressable>
  );
}


function SyntaxHighlighter({language, children, customStyle, fontSize, fontFamily, style} : {language: string, children: string, customStyle: any, fontSize: number, fontFamily: string, style: any}) {
  return (
    <Text>SyntaxHighlighter</Text>
  );
}

const vs2015 = {
}


const VersionInfo = {
  getConstants: () => {
    return {
      appVersion: '1.0.0',
    };
  }
}

export { AsyncStorage, Clipboard, Markdown, Picker, Popup, SyntaxHighlighter, vs2015, VersionInfo }