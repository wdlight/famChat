import { View, Text, FlatList } from 'react-native'
import React from 'react'


import ChatListItem from "../components/ChatListItem";
import chats from '../../assets/data/chats.json';




const ChatListScreen = () => {
  return (
    <FlatList
      data={chats}
      renderItem={ ({item}) => <ChatListItem chat={item}/>}
    >

    </FlatList>
  )
} 

export default ChatListScreen