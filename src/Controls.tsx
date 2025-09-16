import React from 'react';
import type {
  PropsWithChildren,
  Dispatch,
  SetStateAction
} from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  Text,
  Switch,
  View,
} from 'react-native';
import {
  FluentButton as Button,
} from './FluentControls';
import { StylesContext } from './Styles';
import { CodeBlock } from './CodeBlock';
import Markdown from 'react-native-markdown-display-updated';

type HoverButtonProps = {
  content: string;
  tooltip: string,
  onPress: () => void;
};
function HoverButton({content, tooltip, onPress}: HoverButtonProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);

  const backgroundBaseStyle = {padding: 2, borderRadius: 8, borderWidth: 1, borderColor: 'transparent'};
  const backgroundPressedStyle = {borderColor: 'white', backgroundColor: 'black'};
  const backgroundHoverStyle = {borderColor: 'white', backgroundColor: 'gray'};
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tooltip}
      tooltip={tooltip}
      onPress={onPress}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      {({pressed}) => (
        <View style={[backgroundBaseStyle, pressed ? backgroundPressedStyle : hovering ? backgroundHoverStyle : null]}>
          <Text style={{minWidth: 20, textAlign: 'center'}}>{content}</Text>
        </View>        
      )}
    </Pressable>
  );
}

type AttributionProps = {
  source: string;
};
function Attribution({source}: AttributionProps): JSX.Element {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{fontSize: 12, fontStyle: 'italic'}}>source:</Text>
      <Text style={{fontSize: 12, marginHorizontal: 4}}>{source}</Text>
      <Text style={{fontSize: 12}}>🔍</Text>
    </View>
  );
}

type ConsentSwitchProps = {
  title: string;
  source: string;
  details: string;
  defaultValue?: boolean;
};
function ConsentSwitch({title, source, defaultValue, details}: ConsentSwitchProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const [value, onValueChange] = React.useState(defaultValue);

  return (
    <View
      style={[styles.horizontalContainer, {marginBottom: 8}]}
      tooltip={details}>
      <Switch value={value} onValueChange={onValueChange}/>
      <View>
        <Text>{title}</Text>
        <Attribution source={source}/>
      </View>
    </View>
  );
}

type ImageSelectionProps = {
  image: ImageSourcePropType;
};
function ImageSelection({image}: ImageSelectionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  return (
    <View>
      <Image style={styles.dalleImage} source={image}/>
      <View style={[styles.horizontalContainer, {marginTop: 4, justifyContent: 'space-between'}]}>
        <Button>Variations</Button>
        <Button>Select</Button>
      </View>
    </View>
  );
}

function SwitchWithLabel({label, value, onValueChange}: {label: string, value: boolean, onValueChange: (value: boolean) => void}): JSX.Element {
  return (
    <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
      <Switch
        style={{marginTop: -6}}
        accessibilityLabel={label}
        value={value}
        onValueChange={onValueChange}/>
      <Text style={{marginTop: 4}}>{label}</Text>
    </View>
  );
}

type MoreMenuButtonProps = PropsWithChildren<{
  showMenu: boolean,
  setShowMenu: Dispatch<SetStateAction<boolean>>;
}>;
const MoreMenuButton = React.forwardRef(function MoreMenuButton({showMenu, setShowMenu}: MoreMenuButtonProps, ref): JSX.Element {
  return (
    <View
      ref={ref}>
      <Button
        enabled={!showMenu}
        appearance='subtle'
        accessibilityLabel='More options'
        icon={{ fontSource: { fontFamily: 'Segoe MDL2 Assets', codepoint: 0xE712 } }}
        iconOnly={true}
        tooltip='More options'
        onClick={() => setShowMenu(true)}></Button>
    </View>
  );
});

type FlyoutMenuButtonType = {
  title: string,
  icon?: number,
  onPress: () => void,
}

type FlyoutMenuButtonProps = PropsWithChildren<{
  icon?: number;
  onClick: () => void;
}>;
function FlyoutMenuButton({icon, onClick, children}: FlyoutMenuButtonProps): JSX.Element {
  return (
    <Button
      appearance='subtle'
      icon={icon ? { fontSource: { fontFamily: 'Segoe MDL2 Assets', codepoint: icon } } : undefined}
      onClick={onClick}>{children}</Button>
  );
}

type FlyoutMenuProps = {
  items: FlyoutMenuButtonType[];
  maxWidth?: number;
  maxHeight?: number;
};
function FlyoutMenu({items, maxWidth, maxHeight}: FlyoutMenuProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const placementRef = React.useRef(null);

  const buttonList = items.map((button, index) =>
    <FlyoutMenuButton
      key={index}
      icon={button.icon}
      onClick={() => {
        button.onPress();
        setIsOpen(false);
      }}>{button.title}</FlyoutMenuButton>
  );

  return (
    <>
      <MoreMenuButton
        ref={placementRef}
        showMenu={isOpen}
        setShowMenu={setIsOpen}/>
      <Modal
        visible={isOpen}
        onDismiss={() => setIsOpen(false)}
        placement='bottom-edge-aligned-right'
        target={placementRef.current}>
        <View style={[{maxWidth: maxWidth, maxHeight: maxHeight}, styles.flyoutBackground]}>
          {buttonList}
        </View>
      </Modal>
    </>
  );
}

type MarkdownWithRulesProps = {
  content?: string;
};
function MarkdownWithRules({content} : MarkdownWithRulesProps): JSX.Element {
  const rules = {
    fence: (node, children, parent, styles) => {
      return (
        <CodeBlock
          key={node.key}
          language={node.sourceInfo}
          content={node.content}/>
        )
      },
  }

  return (
    <Markdown rules={rules}>{content}</Markdown>
  );
}

export { HoverButton, Attribution, ConsentSwitch, ImageSelection, CodeBlock, SwitchWithLabel, FlyoutMenu, MarkdownWithRules };
export type { FlyoutMenuButtonType };