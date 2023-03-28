import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, {useState, useEffect } from 'react'

import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation } from 'aws-amplify';
import { listUsers} from '../graphql/queries';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);

  const navigation = useNavigation();

  useEffect( () => {
    API.graphql( graphqlOperation(listUsers)).then( result =>{
      
      setUsers( result.data?.listUsers?.items);
    })
  }, [])
  return (
    <FlatList
      data={users}
      renderItem={ ({item}) => <ContactListItem user={item}/>}
      style={{backgroundColor: 'white'}}
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
        }}>
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
    >

      <Text style={{ color: "royalblue", fontSize: 16}} >New Group</Text>


    </FlatList>
  )
}

export default ContactsScreen