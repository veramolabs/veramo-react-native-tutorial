
import React, { useEffect, useState } from 'react'
import { Text, TextInput, useTheme } from 'react-native-paper'
import { FlatList, View, KeyboardAvoidingView, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IMessage } from '@veramo/core';
import { StackParamList } from './ChatsRoute';
import { agent } from '../setup'
import { getMockMessages } from '../mock';

type Props = NativeStackScreenProps<StackParamList, 'Thread'>;

export const Thread = ({ route }: Props) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<IMessage[]>([])
  const [text, setText] = React.useState('');

  // Check for existing messages on load and set them to state
  useEffect(() => {

    // agent.dataStoreORMGetMessages({
    //   where: [{ column: 'threadId', value: [route.params.threadId] }],
    //   order: [{ column: 'createdAt', direction: 'ASC' }],
    // })
    getMockMessages(route.params.threadId)
    .then(setMessages)

  }, [])

  return (
    <>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View style={{
              display: 'flex',
              padding: 10,
              backgroundColor: theme.colors.primaryContainer,
              borderRadius: 20,
              margin: 5,
            }}>
              <Text variant='bodyMedium'>{(item.data as any).message || ''}</Text>
            </View>
          </View>
        )}
      />
      <KeyboardAvoidingView  behavior="padding" keyboardVerticalOffset={90}>

        <TextInput
          value={text}
          onChangeText={text => setText(text)}
          />
      </KeyboardAvoidingView>
    </>
  )
}

