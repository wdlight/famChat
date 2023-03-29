import { View, Text, StyleSheet, TextInput, Image } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView} from 'react-native-safe-area-context';
import { API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import { createMessage, updateChatRoom } from '../../graphql/mutations';
import * as ImagePicker from 'expo-image-picker';

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
 

const InputBox = ({chatroom}) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null)

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

    if ( image) {
      newMessage.image = [await uploadFiles(image)]; 
      setImage(null);
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync( {
      //mediaTypes: ImagePicker.MediaTypeOptions.All,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,    // loading image quality .. size 변화?
    })
    console.log ( "Image 🍎🍎🍎🍎 Result. ")
    console.log ( result );


    if ( !result.canceled ) {
      console.log ( "Image 🍎🍎🍎🍎 Result. accepted.. ", result.assets[0].uri, result.uri);
      setImage ( result.assets[0].uri);
    }
  }

  const uploadFiles = async (fileUri) => {
    try {
      const response = await fetch( fileUri);
      const blob = await response.blob();
      const key = `${uuidv4()}.png`;
      await Storage.put( key, blob, {
        contentType: "image/png",
      });
      return key;
    } catch(err){
      console.log ( "Error uploading files:", err)
    }

  }

  return (
    <>
    {
      image && (
        <View style={StyleSheet.attachmentsContainer}>  
          <Image source = {{ uri: image}} style={styles.selectedImage} resizeMode="contain"/>

          <MaterialIcons
            name="highlight-remove"
            onPress={()=> setImage(null)}  
            size={20}
            color="gray"
            style={styles.removeSelectedImage}
          />

            
        </View>
      )
    }
    <SafeAreaView edges={['bottom']} style={styles.container}>
      
      <AntDesign onPress={pickImage} name="plus" size={20} color="royalblue"/>

      <TextInput 
        value={text}
        onChangeText={setText}
        style={styles.input} placeholder="type your message..."/>

      <MaterialIcons 
        onPress={onSend}
        style={styles.send} name="send" size={16} color="white"/>
    </SafeAreaView>
    </>
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
  attachmentsContainer: {
    aligItems: "flex-end",
  },
  selectedImage: {
    width: 100,
    height: 100,
    margin: 5,    
  },
  removeSelectedImage: {
    position: "absolute",
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  }



})
export default InputBox