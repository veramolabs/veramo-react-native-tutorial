
import React, { useEffect, useState } from 'react'
import { List, Divider, FAB } from 'react-native-paper'
import { FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from './ChatsRoute';

// Import the agent from our earlier setup
import { agent } from '../setup'
import { IThread } from '../types';
import { getMessagesParticipants, groupBy } from '../utils';
import { IMessage } from '@veramo/core';
import { getMockMessages } from '../mock';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

type Props = NativeStackScreenProps<StackParamList, 'Threads'>;

export const ThreadList = ({ navigation }: Props) => {
  const [threads, setThreads] = useState<IThread[]>([])

  const createThread = async () => {
    console.log('createThread')
  }


  // Check for existing threads on load and set them to state
  useEffect(() => {

    // agent.dataStoreORMGetMessages({
    //   where: [{ column: 'type', value: ['veramo.io-chat-v1'] }],
    //   order: [{ column: 'createdAt', direction: 'DESC' }],
    // })
    getMockMessages()
    .then((messages) => {
      return messages.filter((m) => m.threadId) as Array<IMessage & { threadId: string }>
    })
    .then((messages) => {
      const threadMessages = groupBy(messages, m => m.threadId)
      const threads: IThread[] = []
      Object.keys(threadMessages).forEach((threadId) => {
        threads.push({
          id: threadId,
          messages: threadMessages[threadId],
          participants: getMessagesParticipants(threadMessages[threadId]),
        })
      })
      setThreads(threads)
    })

  }, [])

  return (
    <>
      <FlatList
        data={threads}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <List.Item
            title={item.participants.join(', ')}
            description={(item.messages[0].data as any).message || ''}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Thread', { threadId: item.id } )}
          />
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={createThread}
      />
    </>
  )
}

