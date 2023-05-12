import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { CredentialsList } from './CredentialsList'
import { Credential } from './Credential'
import { VerifiableCredential } from '@veramo/core';

export type StackParamList = {
  Credentials: undefined;
  Credential: { credential: VerifiableCredential };
};

const Stack = createNativeStackNavigator<StackParamList>();

export const CredentialsRoute = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Credentials" component={CredentialsList} />
      <Stack.Screen name="Credential" component={Credential} />
    </Stack.Navigator>
  </NavigationContainer>
);