import { View, Image, Text, StyleSheet, Pressable } from 'react-native'
import {useNavigation} from '@react-navigation/native';

import { AntDesign, FontAwesome} from "@expo/vector-icons";

import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';




dayjs.extend(relativeTime);



const ContactListItem = ( {user, onPress=()=>{}, selectable = true, isSelect = true} ) => {

  const navigation = useNavigation(); 
  

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
    borderBottomColor: 'lightgray',
    marginRight: 10,
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