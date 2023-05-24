
import React, { useEffect, useState } from 'react'
import { List, Divider, FAB } from 'react-native-paper'
import { FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from './CredentialsRoute';

// Import the agent from our earlier setup
import { agent } from '../setup'
// import some data types:
import { UniqueVerifiableCredential } from '@veramo/core'

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

type Props = NativeStackScreenProps<StackParamList, 'Credentials'>;

export const CredentialsList = ({ navigation }: Props) => {
  const [credentials, setCredentials] = useState<UniqueVerifiableCredential[]>([])

  const createCredential = async () => {
    try {

      const identifiers = await agent.didManagerFind()
      const credential = await agent.createVerifiableCredential({
        proofFormat: 'jwt',
        save: true,
        credential: {
          issuer: { id: identifiers[0].did },
          credentialSubject: {
            foo: 'bar'
          }
        }
      })
      console.log('credential:', credential)
      setCredentials((s) => s.concat([{ verifiableCredential: credential, hash: 'abc' }]))
    } catch (error) {
      console.log(error)
    }
  }


  // Check for existing credentials on load and set them to state
  useEffect(() => {

    agent.dataStoreORMGetVerifiableCredentials()
    .then(setCredentials)

  }, [])

  return (
    <>
      <FlatList
        data={credentials}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <List.Item
            title={item.verifiableCredential.issuanceDate}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Credential', { credential: item.verifiableCredential } )}
          />
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={createCredential}
      />
    </>
  )
}

