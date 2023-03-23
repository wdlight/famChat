import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatListScreen from "../screens/ChatListScreen";
import ContactsScreen from "../screens/ContactsScreen";
import NotImplementedScreen from "../screens/NotImplementedScreen";
import {Ionicons, Entypo} from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="ChatList"
      screenOptions={{
        tabBarStyle: {backgroundColor: 'whitesmoke'},
        headerStyle: {backgroundColor: 'whitesmoke'}
      }}
    >
      <Tab.Screen name="Status" component={NotImplementedScreen} 
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="logo-whatsapp" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name="Calls" component={NotImplementedScreen}  options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="call-outline" size={size} color={color} />
          ),
        }} />

      <Tab.Screen name="Camera" component={NotImplementedScreen}  options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name="ChatList" component={ChatListScreen}  
        options={({navigation}) => ({
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-chatbubbles-sharp" size={size} color={color} />
          ),
          headerRight: () => (
            <Entypo 
              name='new-message' 
              onPress={()=> navigation.navigate('Contacts')}
              size={18} 
              color={'royalblue'}
              style={{ marginRight: 15}}></Entypo>
          )

          
        })} />
      <Tab.Screen name="Settings" component={NotImplementedScreen}  options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }} />
    </Tab.Navigator>
  )
}

export default MainTabNavigator