
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native';
import { Text, Divider } from 'react-native-paper'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from './IdentifiersRoute';


// Import the agent from our earlier setup
import { agent } from '../setup'
// import some data types:
import { DIDResolutionResult } from '@veramo/core'


type Props = NativeStackScreenProps<StackParamList, 'Identifier'>;


export const Identifier = ({ route }: Props) => {
  const { did } = route.params;
  const [resolutionResult, setResolutionResult] = useState<DIDResolutionResult | undefined>()

  // Resolve a DID

  useEffect(() => {
    const resolveDID = async (did: string) => {
      const result = await agent.resolveDid({ didUrl: did })
      console.log(JSON.stringify(result, null, 2))
      setResolutionResult(result)
    }

    resolveDID(did)
  }, [])

  return (
    <ScrollView contentContainerStyle={{padding: 20}}>
      <Text variant='bodyLarge' style={{marginBottom: 15}}>{did}</Text>
      <Text variant='titleSmall' style={{marginBottom: 15}}>Resolution result</Text>
      <Text variant='bodyMedium'>{JSON.stringify(resolutionResult, null, 2)}</Text>
    </ScrollView>

  )
}

