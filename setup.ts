// filename: setup.ts

// imports:
// Core interfaces
import { createAgent, IDataStore, IDataStoreORM, IDIDManager, IKeyManager, IResolver } from '@veramo/core'

// Core identity manager plugin. This allows you to create and manage DIDs by orchestrating different DID provider packages.
// This implements `IDIDManager`
import { DIDManager } from '@veramo/did-manager'

// Core key manager plugin. DIDs use keys and this key manager is required to know how to work with them.
// This implements `IKeyManager`
import { KeyManager } from '@veramo/key-manager'

// This plugin allows us to create and manage `did:ethr` DIDs. (used by DIDManager)
import { EthrDIDProvider } from '@veramo/did-provider-ethr'

// A key management system that uses a local database to store keys (used by KeyManager)
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'

// Storage plugin using TypeORM to link to a database
import { Entities, KeyStore, DIDStore, migrations, PrivateKeyStore } from '@veramo/data-store'

// Core DID resolver plugin. This plugin orchestrates different DID resolver drivers to resolve the corresponding DID Documents for the given DIDs.
// This plugin implements `IResolver`
import { DIDResolverPlugin } from '@veramo/did-resolver'

// the did:ethr resolver package
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
// the did:web resolver package
import { getResolver as webDidResolver } from 'web-did-resolver'

// TypeORM is installed with '@veramo/data-store'
import { DataSource } from 'typeorm'

// filename: setup.ts

// ... imports

// CONSTANTS
// You will need to get a project ID from infura https://www.infura.io
const INFURA_PROJECT_ID = '3586660d179141e3801c3895de1c2eba'

// This is a raw X25519 private key, provided as an example.
// You can run `npx @veramo/cli config create-secret-key` in a terminal to generate a new key.
// In a production app, this MUST NOT be hardcoded in your source code.
const DB_ENCRYPTION_KEY = '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c'

// filename: setup.ts

// ... imports & CONSTANTS

// DB setup:
let dbConnection = new DataSource({
  type: 'expo',
  driver: require('expo-sqlite'),
  database: 'veramo.sqlite',
  migrations: migrations,
  migrationsRun: true,
  logging: ['error', 'info', 'warn'],
  entities: Entities,
}).initialize()

// filename: src/veramo/setup.ts

// ... imports & CONSTANTS & DB setup

// Veramo agent setup
export const agent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM>({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(DB_ENCRYPTION_KEY))),
      },
    }),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: 'did:ethr:goerli',
      providers: {
        'did:ethr:goerli': new EthrDIDProvider({
          defaultKms: 'local',
          network: 'goerli',
          name: 'goerli',
          rpcUrl: 'https://goerli.infura.io/v3/' + INFURA_PROJECT_ID,
          gas: 1000001,
          ttl: 31104001,
        }),
      },
    }),
    new DIDResolverPlugin({
        ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }), // and set it up to support `did:ethr`
        ...webDidResolver(), // and `did:web`
      }),
  ],
})