import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import { View, Text } from 'react-native'
import React from 'react'

import ChatScreen from '../screens/ChatScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ContactsScreen from '../screens/ContactsScreen';
import NewGroupScreen from '../screens/NewGroupScreen';

import MainTabNavigator from './MainTabNavigator'
const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{headerStyle: {backgroundColor: 'whitesmoke', fontSize: 16}}}>
        <Stack.Screen name="Home"  component={MainTabNavigator} options={{headerShown: false}}/>
        {/* <Stack.Screen name="ChatList" component={ChatListScreen}/> */}
        <Stack.Screen name="Chat" component={ChatScreen}/>
        <Stack.Screen name="Contacts" component={ContactsScreen}/>
        <Stack.Screen name="New Group" component={NewGroupScreen}/> 
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator