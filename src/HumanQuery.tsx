import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  HoverButton,
} from './Controls';
import { StylesContext } from './Styles';

type HumanSectionProps = PropsWithChildren<{
  disableEdit?: boolean;
  disableCopy?: boolean;
  contentShownOnHover?: JSX.Element;
}>;
function HumanSection({children, disableEdit, disableCopy, contentShownOnHover}: HumanSectionProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);
  const styles = React.useContext(StylesContext);

  return (
    <Pressable
      style={[styles.sectionContainer, styles.humanSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row', minHeight: 26}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>HUMAN</Text>
        {hovering && !disableCopy && <HoverButton content="📋" onPress={() => console.log("Copy: Not yet implemented")}/>}
        {hovering && !disableEdit && <HoverButton content="📝" onPress={() => {console.log("Edit: Not yet implemented")}}/>}
        {hovering && contentShownOnHover}
      </View>
      {children}
    </Pressable>
  );
}

export { HumanSection }