import { View, Text, StyleSheet, TextInput, Image, FlatList } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { SafeAreaView} from 'react-native-safe-area-context';
import { API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import { createMessage, updateChatRoom, createAttachment } from '../../graphql/mutations';
import * as ImagePicker from 'expo-image-picker';

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";


const InputBox = ({chatroom}) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([])

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

    
    // save the message
    const newMessageData = await API.graphql( 
      graphqlOperation( createMessage, {input: newMessage} )
    )

    //create attachment.
    await Promise.all( files.map( file => 
      addAttachment( file, newMessageData.data.createMessage.id)))
    setFiles([]);

    // set the new message as LastMessage of the ChatRoom    
    await API.graphql( 
      graphqlOperation (updateChatRoom, {
          input : {
            _version: chatroom._version ,
            chatRoomLastMessageId: newMessageData.data.createMessage.id,
            id: chatroom.id,
          }
        }
      ))    
    setText('');
  }

  const addAttachment = async ( file, messageID )=> {
    console.log ( " 🔴🔴: newAttachment ==> check newAttachment of file == uploading file.uri ⭐⭐")
    console.log ( file )
    const newAttachment = {
      storageKey: await uploadFiles(file.uri),
      type: "IMAGE", // make 'ALL' for VIDEOs.

      width: file.width,
      height: file.height,
      duration: file.duration,
      messageID,
      chatroomID: chatroom.id
    }
    console.log ( " : newAttachment ==> check newAttachment of file🔴🔴")
    console.log ( newAttachment );
    return API.graphql( graphqlOperation(createAttachment, {input: newAttachment} ))
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync( {
      //mediaTypes: ImagePicker.MediaTypeOptions.All,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,    // loading image quality .. size 변화?
      allowsMultipleSelection: true,
    })
    
    console.log ( result );

    if ( !result.canceled  ) {
      console.log ( "🍌🍌🍌🍌🍌 -- result.assets check.. printing result.");
      console.log ( result )
      
      if ( result.assets ){
        //setFiles( result?.assets.map( asset => asset.uri))
        setFiles( result.assets )
        console.log ( "setFiles Setting 🍎🍎🍎🍎 Result. accepted.. ", 
                    result.assets );
      }
      
    }
  }

  const uploadFiles = async (fileUrl) => {
    try {
      let contentType = "";
      let extension = "";
      if (fileUrl.endsWith(".png")) {
        contentType = "image/png";
        extension = ".png";
      } else if (fileUrl.endsWith(".jpg") || fileUrl.endsWith(".jpeg")) {
        contentType = "image/jpeg";
        extension = ".jpg";
      } else if (fileUrl.endsWith(".gif")) {
        contentType = "image/gif";
        extension = ".gif";
      } else if (fileUrl.endsWith(".svg")) {
        contentType = "image/svg+xml";
        extension = ".svg";
      } else if (fileUrl.endsWith(".pdf")) {
        contentType = "application/pdf";
        extension = ".pdf";
      } else {
        console.log("Unsupported file type");
        return null;
      }
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const key = `${uuidv4()}${extension}`;
      await Storage.put(key, blob, {
        contentType: contentType,
      });
      return key;
    } catch (err) {
      console.log("Error uploading files: 🔴🔴🔴", err);
      return null;
    }
  };
  

  console.log ( "🍌🍌🍌🍌🍌 [files before return..")
  console.log ( files )
  return (
    <>
    {
      files && (
        <View style={StyleSheet.attachmentsContainer}>  
          <FlatList
            data = {files}
            horizontal
            renderItem={ ({item})=>(
              <>
              <Image 
                key={item}
                source = {{uri: item.uri}} 
                style={styles.selectedImage} 
                resizeMode="contain"/>
              <MaterialIcons
                name="highlight-remove"
                onPress={ ()=> 
                    setFiles( (existingFiles)=> existingFiles.filter((file)=> file !== item) 
                )}  
                size={20}
                color="gray"
                style={styles.removeSelectedImage}
              />
              </>
            )}
          ></FlatList>
          

            
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