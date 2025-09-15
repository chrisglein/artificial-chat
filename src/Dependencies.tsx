import React, { PropsWithChildren } from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import Markdown from 'react-native-markdown-display';
//import {Picker} from '@react-native-picker/picker';
import { SyntaxHighlighter } from 'react-native-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/styles/hljs';
import VersionInfo from './NativeVersionInfo';

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

export { AsyncStorage, Clipboard, Markdown, Picker, SyntaxHighlighter, vs2015, VersionInfo }