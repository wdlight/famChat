import { View, TextInput, FlatList, StyleSheet, Button } from 'react-native'
import React, {useState, useEffect } from 'react'

import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation, Auth } from 'aws-amplify';

import { listUsers} from '../graphql/queries';
import { createChatRoom, createUserChatRoom} from '../graphql/mutations';


import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);  
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { chatRoom, onInviteFriends } = route.params;

  const fetchChatRoom = async () => {
    setLoading( true );
    API.graphql( graphqlOperation(listUsers)).then( result =>{      

      const filteredUsers = result.data?.listUsers?.items.filter( item => !chatRoom.Users.items.some (
        chatRoomUser => !chatRoomUser._deleted && item.id === chatRoomUser.userId

      ))
      console.log ( " 🦸🦸🦸 filtered user list.NewGroupScreen -- set user data ")
      console.log ( filteredUsers )

      setUsers(  filteredUsers
        );
      
    })
    setLoading( false );

  }

  useEffect( () => {
    
    fetchChatRoom();
  }, [])

  useEffect( () => {
    navigation.setOptions( {
      headerRight: () => (
        <Button title="Add to group" 
          disabled={ selectedUserIds.length < 1} 
          onPress={onAddToGroupPress}
          selectable
        ></Button>
      )
    })
  }, [, selectedUserIds])

  
  const onAddToGroupPress = async (  )=> {
    
    // Add the seleted users to the Chat Room
    await Promise.all(

      selectedUserIds.map ( userID => 
        API.graphql( graphqlOperation( 
          createUserChatRoom, {
            input: { chatRoomId: chatRoom.id, userId: userID }
        }))
      )
    )    

    setSelectedUserIds([]);
    
    // Add the clicked user to the Chat Room
    onInviteFriends();
    navigation.goBack();
      
    
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
        onRefresh={fetchChatRoom}    
        refreshing={loading}
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
export default ContactsScreen