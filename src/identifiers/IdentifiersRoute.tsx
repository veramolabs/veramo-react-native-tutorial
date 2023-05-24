import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { IdentifierList } from './IdentifierList'
import { Identifier } from './Identifier'

export type StackParamList = {
  Identifiers: undefined;
  Identifier: { did: string };
};

const Stack = createNativeStackNavigator<StackParamList>();

export const IdentifiersRoute = () => (
  <NavigationContainer theme={DarkTheme}>
    <Stack.Navigator>
      <Stack.Screen name="Identifiers" component={IdentifierList} />
      <Stack.Screen name="Identifier" component={Identifier} />
    </Stack.Navigator>
  </NavigationContainer>
);