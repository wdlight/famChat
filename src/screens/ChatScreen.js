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
import { getChatRoom } from "../graphql/queries"
import {  listMessagesByChatRoom } from "../graphql/customQueries"

import { onCreateMessage, onUpdateChatRoom } from '../graphql/subscriptions';

import { Feather } from "@expo/vector-icons"

const ChatScreen = () => {
  const [ chatRoom, setChatRoom ] = useState(null);
  const [ messages, setMessages ] = useState([]);
  

  const route = useRoute();
  console.log( route);

  const navigation = useNavigation();
  const chatRoomID = route.params.id;
  
  //fetch Chat Rooom
  useEffect( ()=> {
    console.log ( "getChatROOM 🍎 : 🤠")
    console.log ( chatRoomID )
    API.graphql( graphqlOperation( getChatRoom, {id: chatRoomID}))
      .then( result => setChatRoom( result.data?.getChatRoom))

      
      console.log ( "getChatROOM 🍎 : 🤠")
    

    const subscription = API.graphql( graphqlOperation(
      onUpdateChatRoom, { filter : { id: { eq: chatRoomID }}}
    )).subscribe( {
      next: ( {value} ) => {        
        setChatRoom( cr => ( {
          ...(cr||{}),
          ...value.data.onUpdateChatRoom,
        }));
        
      },
      error: err => console.warn(err),
        
    })
    return ()=>subscription.unsubscribe()

  },[chatRoomID])

  // fetch Messages
  useEffect( ()=> {    
    console.log ( "listMessagesByChatRoom🍎 : 🤠")
    API.graphql( graphqlOperation( listMessagesByChatRoom, {
        chatroomID: chatRoomID,
        sortDirection: "DESC"
    }))
      .then( result => {    
        setMessages( result.data?.listMessagesByChatRoom?.items )
      })      

    // Subscribe to new messages
    const subscription = API.graphql (
      graphqlOperation ( onCreateMessage, { filter: {chatroomID : { "eq": chatRoomID}}})
    ).subscribe( {
      next: ({value}) => {        
        setMessages(  m=> [ value.data.onCreateMessage, ...m])
      },
      error: (err) => console.warn(err),
    })

    return () => subscription.unsubscribe();
  },[chatRoomID])

  useEffect ( ()=> {
    console.log ( "navigation SetOption. : 🤠")
    navigation.setOptions( {
      title: route.params.name, 
      headerRight: () => (
        <Feather 
          name="more-vertical" 
          size={24} color="gray"
          onPress = { ()=> navigation.navigate( "Group Info", { id: chatRoomID })}
        />
      )
    });
  }, [route.params.name])

  

  if ( !chatRoom) {  
    return <ActivityIndicator />;
  }
  console.log ( messages )
  

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
    backgroundColor: 'whitesmoke',
  },
  list: {
    padding: 10,
    height: '80%'
    
  }
})
export default ChatScreen