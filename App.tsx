// shims
import '@sinonjs/text-encoding'
import 'react-native-get-random-values'
import '@ethersproject/shims'
import 'cross-fetch/polyfill'

import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { IdentifiersRoute } from './src/identifiers/IdentifiersRoute';
import { CredentialsRoute } from './src/credentials/CredentialsRoute';


const ChatsRoute = () => <Text>Chats</Text>;


function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'identifiers', title: 'Identifiers', focusedIcon: 'account', unfocusedIcon: 'account-outline'},
    { key: 'credentials', title: 'Credentials', focusedIcon: 'certificate', unfocusedIcon: 'certificate-outline' },
    { key: 'chat', title: 'Chat', focusedIcon: 'chat', unfocusedIcon: 'chat-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    identifiers: IdentifiersRoute,
    credentials: CredentialsRoute,
    chat: ChatsRoute,
  });

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      />
    </PaperProvider>
  );
}

export default App