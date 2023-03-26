import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView} from 'react-native-safe-area-context';
import { API, graphqlOperation, Auth} from 'aws-amplify';
import { createMessage, updateChatRoom } from '../../graphql/mutations';

const InputBox = ({chatroom}) => {
  const [text, setText] = useState('');

  /////////////////////////////////////
  // onSend message
  // also set Last Message.
  const onSend = async () => {
    
    const authUser = await Auth.currentAuthenticatedUser();    
    const newMessage = {
      chatroomID: chatroom.id,
      text,
      userID: authUser.attributes.sub
    }    
    const newMessageData = await API.graphql( graphqlOperation(
      createMessage, {input: newMessage} 
    ))
    

    // set the new message as LastMessage of the ChatRoom
    console.log ("000000000000000000000LASTMESSAGE return..========>>>>>>")
    console.log ( newMessageData.data.createMessage.id)
    const lastMsg  = await API.graphql( graphqlOperation 
      (
        updateChatRoom,
        {
          input : {
            _version: chatroom._version ,
            chatRoomLastMessageId: newMessageData.data.createMessage.id,
            id: chatroom.id,
          }
        }
      ))
    console.log ("000000000000000000000LASTMESSAGE return..")
    console.log ( lastMsg.data.updateChatRoom )
    console.log ( text )
    console.log ( newMessageData.data.createMessage.id )
    setText('');
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <AntDesign name="plus" size={20} color="royalblue"/>
      <TextInput 
        value={text}
        onChangeText={setText}
        style={styles.input} placeholder="type your message..."/>

      <MaterialIcons 
        onPress={onSend}
        style={styles.send} name="send" size={16} color="white"/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container: {
    flexDirection: 'row',
    backgroundColor: 'whitesmoke',
    padding: 5,
    paddingHorizontal: 10,    
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderColor: 'lightgray',
    borderWidth: StyleSheet.hairlineWidth,
  },
  
  send: {
    backgroundColor: 'royalblue',
    padding: 7,
    borderRadius: 15,
    overflow: 'hidden'

  },
})
export default InputBox