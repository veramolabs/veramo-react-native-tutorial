// shims
import '@sinonjs/text-encoding'
import 'react-native-get-random-values'
import '@ethersproject/shims'
import 'cross-fetch/polyfill'
// filename: App.tsx

// ... shims

import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, Button } from 'react-native'

// Import the agent from our earlier setup
import { agent } from './setup'
// import some data types:
import { DIDResolutionResult, IIdentifier } from '@veramo/core'
import { VerifiableCredential } from '@veramo/core-types'

const App = () => {
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([])
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([])
  const [resolutionResult, setResolutionResult] = useState<DIDResolutionResult | undefined>()

  // Resolve a DID
  const resolveDID = async (did: string) => {
    const result = await agent.resolveDid({ didUrl: did })
    console.log(JSON.stringify(result, null, 2))
    setResolutionResult(result)
  }

  // Add the new identifier to state
  const createIdentifier = async () => {
    // console.log("create identifier 2. agent: ", agent)
    // const _ids = await agent.didManagerFind()
    // console.log("_ids2: ", _ids)
    try {
      const _id = await agent.didManagerCreate({
        alias: 'default2',
        provider: 'did:peer',
        options: {
          num_algo: 2,
          service: { type: 'DIDCommMessaging', serviceEndpoint: "did:web:dev-didcomm-mediator.herokuapp.com" } 
        }
      })
      console.log("identifier created: ", _id)
      setIdentifiers((s) => s.concat([_id]))
    } catch (ex) {
      console.log("something failed. ex: ", ex)
    }
  }

    // Add the new identifier to state
    const createCredential = async () => {
      // console.log("createCredential 2. agent: ", agent)
      // const _ids = await agent.didManagerFind()
      // console.log("_ids2: ", _ids)
      console.log("issuer: ", identifiers[0].did)
      try {
        const _cred = await agent.createVerifiableCredential({
          credential: {
            issuer: { id: identifiers[0].did },
            credentialSubject: {
              id: 'did:web:example.com',
              you: 'Rock',
            },
          },
          proofFormat: 'jwt',
        })
        console.log("yes credential: ", _cred)
        setCredentials((s) => s.concat([_cred]))
      } catch (ex) {
        console.log("something failed. ex: ", ex)
      }
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
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Identifiers</Text>
          <Button onPress={() => createIdentifier()} title={'Create Identifier'} />
          <Button onPress={() => createCredential()} title={'Create Credential'} />
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {identifiers && identifiers.length > 0 ? (
              identifiers.map((id: IIdentifier) => (
                <Button onPress={() => resolveDID(id.did)} title={id.did} key={id.did} />
              ))
            ) : (
              <Text>No identifiers created yet</Text>
            )}
          </View>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Resolved DID document:</Text>
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {resolutionResult ? (
              <Text>{JSON.stringify(resolutionResult.didDocument, null, 2)}</Text>
            ) : (
              <Text>tap on a DID to resolve it</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default App