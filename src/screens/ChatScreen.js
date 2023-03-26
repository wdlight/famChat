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


const ChatScreen = () => {
  const [ chatRoom, setChatRoom ] = useState(null);

  const route = useRoute();
  console.log( route);

  const navigation = useNavigation();
  const chatRoomID = route.params.id;
  
  useEffect( ()=> {
    API.graphql( graphqlOperation( getChatRoom, {id: chatRoomID}))
      .then( result => setChatRoom( result.data?.getChatRoom))
  },[])
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
    <ImageBackground source={bg} style={StyleSheet.bg}>
      <FlatList
        data={chatRoom.Messages.items}
        renderItem={ ({item})=> <Message message={item}/>}
        style={styles.list}
        inverted
      />
      <InputBox chatroom={chatRoom}/>
    </ImageBackground>
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
    height: '91%'
    
  }
})
export default ChatScreen