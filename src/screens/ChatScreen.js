import { View, Text, ImageBackground, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native';
import React , { useEffect } from 'react'
import bg from '../../assets/images/BG.png'
import Message from '../components/Message'
import InputBox from '../components/InputBox'
import messages from '../../assets/data/messages.json'

const ChatScreen = () => {
  const route = useRoute();
  console.log( route);

  const navigation = useNavigation();

  

  useEffect ( ()=> {
    navigation.setOptions( {title: route.params.name});
  }, [route.params.name])


  return (
    <KeyboardAvoidingView behavior={Platform.OS ==='ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 90}
    style={styles.bg}
    >
    <ImageBackground source={bg} style={StyleSheet.bg}>
      <FlatList
        data={messages}
        renderItem={ ({item})=> <Message message={item}/>}
        style={styles.list}
        inverted
      />
      <InputBox/>
    </ImageBackground>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create( {
  bg: {
    flex: 1,    
    backgroundColor: 'red',
  },
  list: {
    padding: 10,
    height: '94%'
    
  }
})
export default ChatScreen