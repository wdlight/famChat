import { View, TextInput, FlatList, StyleSheet, Button } from 'react-native'
import React, {useState, useEffect } from 'react'

import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation, Auth } from 'aws-amplify';

import { listUsers} from '../graphql/queries';
import { createChatRoom, createUserChatRoom} from '../graphql/mutations';


import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const NewGroupScreen = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("")
  const [selectedUserIds, setSelectedUserIds] = useState([])

  const navigation = useNavigation();

  useEffect( () => {
    API.graphql( graphqlOperation(listUsers)).then( result =>{      
      setUsers( result.data?.listUsers?.items);
      console.log ( " 🦸🦸🦸 NewGroupScreen -- set user data ")
      console.log ( result.data?.listUsers?.items )
    })
  }, [])

  useEffect( () => {
    navigation.setOptions( {
      headerRight: () => (
        <Button title="Create" 
          disabled={!name || selectedUserIds.length < 1} 
          onPress={onCreateGroupPress}
          selectable
        ></Button>
      )
    })
  }, [name, selectedUserIds])

  
  const onCreateGroupPress = async (  )=> {
    
    // Create a new Chatroom
    const newChatRoomData = await API.graphql( graphqlOperation(
      createChatRoom, { input : { name }}
    ))  
    if (!newChatRoomData.data?.createChatRoom) {
      console.log("Error creating the chat error");
    }
    const newChatRoom = newChatRoomData.data?.createChatRoom;

    // Add the seleted users to the Chat Room
    await Promise.all(

      selectedUserIds.map ( userID => 
        API.graphql( graphqlOperation( 
          createUserChatRoom, {
            input: { chatRoomId: newChatRoom.id, userId: userID }
        }))
      )
    )
    

    const authUser = await Auth.currentAuthenticatedUser();            
    await API.graphql( graphqlOperation( 
      createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub }
    }))

    setSelectedUserIds([]);
    setName("")
    // Add the clicked user to the Chat Room
    navigation.navigate( "Chat", {id: newChatRoom.id});
      
    
  }


  const onContactPress = (id) => {
    setSelectedUserIds( (userIds) => {
      if ( userIds.includes(id)){
        // remove id from selected
        return [...userIds].filter(uid => uid !== id);
      }
      else{
        return [...userIds,id];
      }
    })
  }

  
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Group name"
        value={name}
        onChangeText={setName}
        style={styles.input}

      ></TextInput>

      <FlatList   
        data={users}
        renderItem={ ({item}) => (
          <ContactListItem 
            user={item}
            selectable
            onPress={()=> onContactPress(item.id)}
            isSelected={selectedUserIds.includes(item.id)}

          />
        )}        
      />
    </View>


    
  )
}

const styles = StyleSheet.create( {
  container: { backgroundColor: "white"},
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    padding: 10,
    margin: 10,
  }
})
export default NewGroupScreen