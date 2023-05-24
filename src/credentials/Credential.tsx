
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native';
import { Text } from 'react-native-paper'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from './CredentialsRoute';


type Props = NativeStackScreenProps<StackParamList, 'Credential'>;


export const Credential = ({ route }: Props) => {
  const { credential } = route.params;

  return (
    <ScrollView contentContainerStyle={{padding: 20}}>
      <Text variant='bodyMedium'>{JSON.stringify(credential, null, 2)}</Text>
    </ScrollView>

  )
}

