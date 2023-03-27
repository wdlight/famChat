import { View, Image, Text, StyleSheet, Pressable } from 'react-native'
import {useNavigation} from '@react-navigation/native';
import React,{ useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { API, graphqlOperation, Auth } from 'aws-amplify'


dayjs.extend(relativeTime);

const ChatListItem = ( {chat} ) => {  
  const [user, setUser] = useState();
  const navigation = useNavigation();
  



  useEffect( ()=>{
    const fetchUsers = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      
      const userlist = chat.users.items;
      console.log ( chat.users.items.map( item => item.user.id) )
      console.log (">>>>>>>" )
      console.log ( userlist )
      const userItem = userlist.find(
        (item) => item.user.id !== authUser.attributes.sub
      )
      setUser( userItem?.user);
    }

    fetchUsers();    
    
  }, [])
  
  

  return (
    <Pressable 
      onPress={()=> navigation.navigate('Chat', {id: chat.id, name: user?.name})} 
      style={styles.container}> 
      <Image 
        style={styles.avatar}
        source={{ uri: user?.image}}        
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>{user?.name}</Text>
          
          { chat.LastMessage && 
            <Text style={styles.subTitle}>
            {dayjs(chat.LastMessage?.createdAt).fromNow(true)}
            </Text> 
          }
          

        </View>
        <Text numberOfLined={2} style={styles.message}>
          {chat.LastMessage?.text}
        </Text>
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
  row: {
    flexDirection: 'row',
  },
  name: {
    flex:1,
    fontWeight: 'bold',
  },
  message: {
    color: 'gray',
  },


})
export default ChatListItem