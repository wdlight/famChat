import { View, Text, ImageBackground, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import bg from '../../assets/images/BG.png'
import Message from '../components/Message'
import InputBox from '../components/InputBox'
import messages from '../../assets/data/messages.json'

const ChatScreen = () => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS ==='ios' ? 'padding' : 'height'}>
    <ImageBackground source={bg} style={StyleSheet.bg}>
      <FlatList
        data={messages}
        renderItem={ ({item})=> <Message message={item}/>}
        style={styles.list}
        inverted
      />
    <InputBox></InputBox>
    </ImageBackground>
    </KeyboardAvoidingView>
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