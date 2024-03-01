import React, { PropsWithChildren } from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from './NativeClipboard'
import Markdown from 'react-native-markdown-display';
//import {Picker} from '@react-native-picker/picker';
//import {Popup} from 'react-native-windows';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/styles/hljs';
import VersionInfo from './NativeVersionInfo'

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
      <Text>{props.value}</Text>
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
      style={isOpen ? 
        {position: 'absolute', width: '100%', height: '100%', alignItems: 'center'} :
        {display: 'none'}
      }
      onPress={() => {
        if (isLightDismissEnabled) {
          onDismiss();
        }
      }}>
      {isOpen && 
        <View>
          {children}
        </View>
      }
    </Pressable>
  );
}

export { AsyncStorage, Clipboard, Markdown, Picker, Popup, SyntaxHighlighter, vs2015, VersionInfo }