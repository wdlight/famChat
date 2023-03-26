import { View, Image, Text, StyleSheet, Pressable } from 'react-native'
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { createChatRoom, createUserChatRoom} from '../../graphql/mutations'
import {getMyChatRooms} from '../../services/chatRoomService'

dayjs.extend(relativeTime);



const ContactListItem = ( {user} ) => {
  const navigation = useNavigation();
  
  const onPress = async ()=> {
    // check if we already have a ChatRoom with user
    await getMyChatRooms ( user.id)
      .then( async (existingChatRoom) => {

        if ( existingChatRoom != undefined ){
          navigation.navigate( "Chat", { id : existingChatRoom.chatRoom.id })
          return;
        }
        // Create a new Chatroom
        const newChatRoomData = await API.graphql( graphqlOperation(
          createChatRoom, { input : {}}
        ))  
        if (!newChatRoomData.data?.createChatRoom) {
          console.log("Error creating the chat error");
        }
        const newChatRoom = newChatRoomData.data?.createChatRoom;
    
        await API.graphql( graphqlOperation( createUserChatRoom, {
          input: { chatRoomId: newChatRoom.id, userId: user.id }
        }))
        const authUser = await Auth.currentAuthenticatedUser();
        
        console.log("====createUserChatRoom >>>>>>22222222")
        await API.graphql( graphqlOperation( createUserChatRoom, {
          input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub }
        }))
        // Add the clicked user to the Chat Room
        navigation.navigate( "Chat", {id: newChatRoom.id})
      });
    
  }

  return (
    <Pressable 
      onPress={onPress} 
      style={styles.container}>        
      <Image 
        style={styles.avatar}
        source={{ uri: user.image }}        
      />
      <View style={styles.content}>
        
          <Text numberOfLines={1} style={styles.name}>{user.name}</Text>          
          <Text numberOfLines={1} style={styles.subTitle}>{user.status}</Text>          
        
        
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create( {
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70,
    alignItems: 'center'

  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'lightgray'
  },
  
  name: {
    
    fontWeight: 'bold',
  },
  subTitle: {
    color: 'gray'
  },
  content: {}
  
})
export default ContactListItem