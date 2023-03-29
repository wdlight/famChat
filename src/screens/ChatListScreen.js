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
    
    const response = await API.graphql(
      graphqlOperation( listChatRooms, { id: authUser.attributes.sub })
    );
    
    const rooms = response?.data?.getUser?.ChatRooms?.items.filter( item => !item._deleted );
    console.log ( ": 🍎🍎🍎🍎", rooms.length )
    console.log ( response?.data?.getUser?.ChatRooms?.items.map( i => i._deleted) )

    const sortedRooms = rooms.
      sort((a, b) => {
        if (!a.chatRoom || !b.chatRoom) {
          return 0; // if chatRoom property is not present, return 0
        }
        return new Date(b.chatRoom.updatedAt) - new Date(a.chatRoom.updatedAt);
      });
    setChatRooms( sortedRooms );

    setLoading( false); 
  } 


  useEffect( ()=>{    
    fetchChatRooms();
  },[])
  return (
    <FlatList
      data={chatRooms}
      renderItem={ ({item}) => {        
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