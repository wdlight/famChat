import { View, Text, ImageBackground, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import bg from '../../assets/images/BG.png'
import Message from '../components/Message'

import messages from '../../assets/data/messages.json'

const ChatScreen = () => {
  return (
    <ImageBackground source={bg} style={StyleSheet.bg}>
      <FlatList
        data={messages}
        renderItem={ ({item})=> <Message message={item}/>}
        style={styles.list}
        inverted
      />
    </ImageBackground>
  )
}


const styles = StyleSheet.create( {
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  }
})
export default ChatScreen