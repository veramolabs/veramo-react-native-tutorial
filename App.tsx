import '@sinonjs/text-encoding'
import 'react-native-get-random-values'
import '@ethersproject/shims'
import 'cross-fetch/polyfill'


import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, Button } from 'react-native'

// Import the agent from our earlier setup
import { agent } from './setup'
// import some data types:
import { IIdentifier } from '@veramo/core'
import { DIDResolutionResult } from '@veramo/core'
import { VerifiableCredential } from '@veramo/core'
import { IVerifyResult } from '@veramo/core'

const App = () => {
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([])
  const [resolutionResult, setResolutionResult] = useState<DIDResolutionResult | undefined>()
  const [credential, setCredential] = useState<VerifiableCredential | undefined>()
  const [verificationResult, setVerificationResult] = useState<IVerifyResult | undefined>()

  // Add the new identifier to state
  const createIdentifier = async () => {
    const _id = await agent.didManagerCreate({
      provider: 'did:peer',
      options: {
        num_algo: 2,
        service: { id: '1', type: 'DIDCommMessaging', serviceEndpoint: "did:web:dev-didcomm-mediator.herokuapp.com", description: 'for messaging' } 
      }
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

  // Resolve a DID
  const resolveDID = async (did: string) => {
    const result = await agent.resolveDid({ didUrl: did })
    console.log(JSON.stringify(result, null, 2))
    setResolutionResult(result)
  }

  const createCredential = async () => {
    if (identifiers[0].did) {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifiers[0].did },
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: 'did:web:community.veramo.io',
            you: 'Rock',
          },
        },
        save: false,
        proofFormat: 'jwt',
      })

      setCredential(verifiableCredential)
    }
  }

  const verifyCredential = async () => {
    if (credential) {
      const result = await agent.verifyCredential({ credential })
      setVerificationResult(result)
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Identifiers</Text>
          <Button onPress={() => createIdentifier()} title={'Create Identifier'} />
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {identifiers && identifiers.length > 0 ? (
              identifiers.map((id: IIdentifier) => (
                <Button key={id.did} onPress={() => resolveDID(id.did)} title={id.did} />
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
        <View style={{ padding: 20 }}>
          <Button
            title={'Create Credential'}
            disabled={!identifiers || identifiers.length === 0}
            onPress={() => createCredential()}
          />
          <Text style={{ fontSize: 10 }}>{JSON.stringify(credential, null, 2)}</Text>
        </View>
        <View style={{ padding: 20 }}>
          <Button title={'Verify Credential'} onPress={() => verifyCredential()} disabled={!credential} />
          <Text style={{ fontSize: 10 }}>{JSON.stringify(verificationResult, null, 2)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default App