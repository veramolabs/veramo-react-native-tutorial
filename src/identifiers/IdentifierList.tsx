
import React, { useEffect, useState } from 'react'
import { List, Divider, FAB } from 'react-native-paper'
import { FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from './IdentifiersRoute';

// Import the agent from our earlier setup
import { agent } from '../setup'
// import some data types:
import { IIdentifier } from '@veramo/core'

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

type Props = NativeStackScreenProps<StackParamList, 'Identifiers'>;

export const IdentifierList = ({ navigation }: Props) => {
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([])

  // Add the new identifier to state
  const createIdentifier = async () => {
    const _id = await agent.didManagerCreate({
      provider: 'did:ethr:goerli',
    })
    setIdentifiers((s) => s.concat([_id]))
  }

  // Check for existing identifers on load and set them to state
  useEffect(() => {
    const getIdentifiers = async () => {
      const _ids = await agent.didManagerFind()
      setIdentifiers(_ids)

      // Inspect the id object in your debug tool
      console.log('_ids:', _ids)
    }

    getIdentifiers()
  }, [])

  return (
    <>
      <FlatList
        data={identifiers}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <List.Item
            title={item.did}
            description={item.provider}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Identifier', { did: item.did } )}
          />
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={createIdentifier}
      />
    </>
  )
}

