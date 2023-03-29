import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native'
import React, {useState, useEffect } from 'react'

import ContactListItem from "../components/ContactListItem";
import { listUsers} from '../graphql/queries';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

import { API, graphqlOperation, Auth } from 'aws-amplify'
import { createChatRoom, createUserChatRoom} from '../graphql/mutations';
import {getMyChatRooms} from '../services/chatRoomService';


const ContactsScreen = () => {
  const [users, setUsers] = useState([]);
  

  const navigation = useNavigation();

  

  useEffect( () => {
        API.graphql( graphqlOperation(listUsers)).then( result =>{
      console.log ( ": 🍏🍏🍏 listUsers ===")
      console.log ( result.data )    

      setUsers( result.data?.listUsers?.items);
    })
  }, [])

  const createAChatRoomWithTheUser = async ( user )=> {
    
    // Check if we already have a ChatRoom with user
    console.log ( " createAChatRoomWithTheUser Called. --  🍌🍌🍌🍌")
    const existingChatRoom = await getMyChatRooms(user.id);
    if (existingChatRoom) {
      console.log ( " existingChatRoom .. navigate to Chat!! Called. --  🍌🍌🍌🍌")
      navigation.navigate("Chat", { id: existingChatRoom.chatRoom.id });
      return;
    }

    // Create a new Chatroom
    const newChatRoomData = await API.graphql( graphqlOperation(
      createChatRoom, { input : {}}
    ))  
    if (!newChatRoomData.data?.createChatRoom) {
      console.log("Error creating the chat error");
      Alert.alert ( 'Create Room Failed.', 'createChatRoom graphQL failed', 
      [{
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ])
      return;
    }
    const newChatRoom = newChatRoomData.data?.createChatRoom;    

    await API.graphql( graphqlOperation( createUserChatRoom, {
      input: { chatRoomId: newChatRoom.id, userId: user.id }
    }))
    console.log ( "user info 🦸‍♂️🦸‍♂️🦸‍♂️ graphQL createUserChatRoom 🌈")
    console.log ( user )


    const authUser = await Auth.currentAuthenticatedUser();        
    console.log("==== Adding authUser to ChatRoom >>>>>>22222222")
    await API.graphql( graphqlOperation( createUserChatRoom, {
      input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub }
    }))


    // Add the clicked user to the Chat Room
    console.log ( "final navigate to Chat : ✈️✈️✈️✈️")
    navigation.navigate( "Chat", {id: newChatRoom.id})  
    
  }

  return (
    <FlatList

      // Header to New Group Display
      ListHeaderComponent={()=> (
      <Pressable 
        onPress={()=> {
          navigation.navigate( "New Group")
        }}
        style ={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          paddingHorizontal: 20,
          backgroundColor: 'whitesmoke',
        }}
      >
        <MaterialIcons name="group"
          size={24} color="royalblue"
          style={{
          marginRight: 20,
          backgroundColor: "gainsboro",
          padding: 7,
          borderRadius: 20,
          overflow: "hidden"
        }}>
        </MaterialIcons>
        <Text style={{ color: "royalblue", fontSize: 16}} >New Group</Text>
      </Pressable>
      )}


      data={users}
      renderItem={ ({item}) => (
        <ContactListItem user={item} 
          onPress={()=>createAChatRoomWithTheUser(item)}
        />
      )}
      style={{backgroundColor: 'white'}}
      
    >

      <Text style={{ color: "royalblue", fontSize: 16}} >New Group</Text>


    </FlatList>
  )
}

export default ContactsScreen