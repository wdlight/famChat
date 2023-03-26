import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, {useState, useEffect } from 'react'

import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation } from 'aws-amplify';
import { listUsers} from '../graphql/queries';


const ContactsScreen = () => {
  const [users, setUsers] = useState([]);

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
    >

    </FlatList>
  )
}

export default ContactsScreen