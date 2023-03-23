import { View, Image, Text, StyleSheet } from 'react-native'
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ChatListItem = ( {chat} ) => {
  console.log ( chat )
  return (
    <View style={styles.container}> 
      <Image 
        style={styles.avatar}
        source={{ uri: chat.user.image}}        
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>{chat.user.name}</Text>
          <Text style={styles.subTitle}>{dayjs(chat.lastMessage.createdAt).fromNow(true)}</Text>
        </View>
        <Text numberOfLined={2} style={styles.message}>{chat.lastMessage.text} </Text>
      </View>
    </View>
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