import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React , { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Auth, Storage } from 'aws-amplify';
import {S3Image} from 'aws-amplify-react-native';
import ImageView from 'react-native-image-viewing';


const Message = ({message}) => {
  const [isMe, setIsMe] = useState(false)
  const [imageSources, setImageSources] = useState([])
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect ( ()=> {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();      
      setIsMe ( message.userID === authUser.attributes.sub )      
    }

    isMyMessage();
  }, [])
  
  useEffect( ()=> {
    const downloadImages = async () => {
      console.log ( "🍌🍌🍌🍌🍌")
      console.log ( message.image )
      if ( message.image?.length > 0 ){        
        const uris = await Promise.all( message.image.map( Storage.get) );
        setImageSources( uris?.map( (uri)=>({uri}) ) );
      }
    }
    downloadImages();
  },[message.image])

  return (
    <View 
      style={[styles.container, 
        {
          backgroundColor: isMe ? '#DCF8C5' : 'white',
          alignSelf: isMe ? 'flex-end' : 'flex-start'
        }
      ]}
    > 
      {imageSources.length > 0 && (
        <>
        {/* //  <S3Image imgKey={message.image[0]} style={styles.image} />  */}
        { imageSources.map( img => (
          <Pressable onPress={()=> {               
              setImageViewerVisible(true);}}>
            <Image             
              source={img} style={styles.image} /> 
          </Pressable>
        ))}
        

        <ImageView
          images={imageSources}
          imageIndex={0}
          visible={imageViewerVisible}
          onRequestClose={()=> { setImageViewerVisible(false)}}
        />
        </>      
      )
      
      }
      <Text>{message.text}</Text>
      <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
    </View>
  )
}

const styles = StyleSheet.create( {
  container: {
    
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,    
    elevation: 5,
    
  },
  time: {
      color: 'gray',
      alignSelf: 'flex-end',
  },
  image: {
    width: 200,
    height: 100,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 5,
  }
})

export default Message