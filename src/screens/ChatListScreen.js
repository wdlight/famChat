import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState} from 'react'


import ChatListItem from "../components/ChatListItem";
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { listChatRooms } from '../graphql/customQueries'



const ChatListScreen = () => {
  const [chatRooms, setChatRooms] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchChatRooms = async() => {
    setLoading( true);
    
    const authUser = await Auth.currentAuthenticatedUser();
    
    console.log ( "🍎🍎🍎🍎" + authUser.attributes.sub )
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
    setChatRooms( sortedRooms );

    console.log ( "::  🍎 ==> SortedRooms info")
    console.log( sortedRooms.map( r => r.chatRoom?.LastMessage));

    setLoading( false); 
  } 


  useEffect( ()=>{    
    fetchChatRooms();
  },[])
  return (
    <FlatList
      data={chatRooms}
      renderItem={ ({item}) => {
        console.log ( "🍏🍏🍏🍏🍏=ChatScreen: rendering.")
        console.log ( item.chatRoom.LastMessage?.text )
        return <ChatListItem chat={item.chatRoom}/>
      } }
      style={{backgroundColor: 'white'}}
      refreshing={loading}
      onRefresh={ fetchChatRooms }
    >

    </FlatList>
  )
} 

export default ChatListScreen