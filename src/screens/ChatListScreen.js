import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState} from 'react'


import ChatListItem from "../components/ChatListItem";
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { listChatRooms } from '../graphql/customQueries'




const ChatListScreen = () => {
  const [chatRooms, setChatRooms] = useState([])
  useEffect( ()=>{
    const fetchChatRooms = async() => {
      const authUser = await Auth.currentAuthenticatedUser();
      const response = await API.graphql(
        graphqlOperation( listChatRooms, { id: authUser.attributes.sub })
      );

      const rooms = response?.data?.getUser?.ChatRooms?.items;
      console.log ( rooms )
      const sortedRooms = rooms.
      sort((a, b) => {
        if (!a.chatRoom || !b.chatRoom) {
          return 0; // if chatRoom property is not present, return 0
        }
        return new Date(b.chatRoom.updatedAt) - new Date(a.chatRoom.updatedAt);
      });
      
      
      // sort( (r1, r2) => {        
      //   if (!r1.chatRoom || !r2.chatRoom) {
      //     return 0; // if chatRoom property is not present, return 0
      //   }
      //   return new Date( r2.chatRoom.updatedAt)  -  new Date( r1.chatRoom.updatedAt )                 
      // })
      console.log( "00000000000000000")
      console.log ( sortedRooms.map( room => room.chatRoom.updatedAt) )
      console.log ( rooms.map( room => room.chatRoom.updatedAt) )
      setChatRooms( sortedRooms );
    } 

    fetchChatRooms();

  },[])
  return (
    <FlatList
      data={chatRooms}
      renderItem={ ({item}) => <ChatListItem chat={item.chatRoom}/>}
      style={{backgroundColor: 'white'}}
    >

    </FlatList>
  )
} 

export default ChatListScreen