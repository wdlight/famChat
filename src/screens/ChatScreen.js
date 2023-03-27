import { View, Text, 
  ImageBackground, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView,
  ActivityIndicator } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native';
import React , { useEffect, useState } from 'react'
import bg from '../../assets/images/BG.png'
import Message from '../components/Message'
import InputBox from '../components/InputBox'
import messages from '../../assets/data/messages.json'

import { API, graphqlOperation } from 'aws-amplify'
import { getChatRoom, listMessagesByChatRoom } from "../graphql/queries"


const ChatScreen = () => {
  const [ chatRoom, setChatRoom ] = useState(null);
  const [ messages, setMessages ] = useState([]);
  const route = useRoute();
  console.log( route);

  const navigation = useNavigation();
  const chatRoomID = route.params.id;
  
  //fetch Chat Rooom
  useEffect( ()=> {
    console.log ( "+++++++++ fetch Chat Room CHat ROOM ID +++++++", chatRoomID)
    API.graphql( graphqlOperation( getChatRoom, {id: chatRoomID}))
      .then( result => setChatRoom( result.data?.getChatRoom))
  },[chatRoomID])

  // fetch Messages
  useEffect( ()=> {
    console.log ( "+++++++++ fetch Messages CHat ROOM ID +++++++", chatRoomID)
    API.graphql( graphqlOperation( listMessagesByChatRoom, {
        chatroomID: chatRoomID,
        sortDirection: "DESC"
    }))
      .then( result => {
        console.log ( "== == == == listMessagesByChatRoom",result.data?.listMessagesByChatRoom?.items )
        setMessages( result.data?.listMessagesByChatRoom?.items )
      })      
  },[chatRoomID])

  useEffect ( ()=> {
    navigation.setOptions( {title: route.params.name});
  }, [route.params.name])

  

  if ( !chatRoom) {
    return <ActivityIndicator />;
  }
  
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS ==='ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 90}
    style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={ ({item})=> <Message message={item}/>}
          style={styles.list}
          inverted
        />
        
      </ImageBackground>
      <InputBox chatroom={chatRoom}/>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create( {
  bg: {
    flex: 1,    
    backgroundColor: 'red',
  },
  list: {
    padding: 10,
    height: '80%'
    
  }
})
export default ChatScreen