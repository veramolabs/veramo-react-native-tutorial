import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { ThreadList } from './ThreadList'
import { Thread } from './Thread'

export type StackParamList = {
  Threads: undefined;
  Thread: { threadId: string };
};

const Stack = createNativeStackNavigator<StackParamList>();

export const ChatsRoute = () => (
  <NavigationContainer theme={DarkTheme}>
    <Stack.Navigator>
      <Stack.Screen name="Threads" component={ThreadList} />
      <Stack.Screen name="Thread" component={Thread} />
    </Stack.Navigator>
  </NavigationContainer>
);