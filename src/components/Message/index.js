import { View, Text, StyleSheet, Image, Pressable, useWindowDimensions } from 'react-native'
import React , { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Auth, Storage } from 'aws-amplify';
import {S3Image} from 'aws-amplify-react-native';
import ImageView from 'react-native-image-viewing';
import { Video } from "expo-av";

import ImageAttachment from './ImageAttachment';

import VideoAttachment from './VideoAttachment';
const Message = ({message}) => {
  const [isMe, setIsMe] = useState(false)  
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [downloadedAttachments, setDownloadedAttachments] = useState([])
  
  const { width } = useWindowDimensions();

  useEffect ( ()=> {
    const isMyMessage = async () => {
      const authUser = await Auth.currentAuthenticatedUser();      
      setIsMe ( message.userID === authUser.attributes.sub )      
    }

    isMyMessage();
  }, [])
  
  useEffect( ()=> {
    const downloadAttachments = async () => {
      console.log ( "⬇️-- downloadAttachment Start ⬇️⬇️ : message.Attachments")
      console.log ( message.Attachments )
      if ( message.Attachments.items ){        
        const downloadedAttachments = await Promise.all (
          message.Attachments.items.map ( (attachment) => 
            Storage.get( attachment.storageKey ).then ( uri => ({
              ...attachment,
              uri,
            }))
          )
        );
        setDownloadedAttachments(downloadedAttachments ) ;        
      }
    }
    downloadAttachments();
  },[JSON.stringify(message.Attachments.items)])

  const maxContainerWidth = width * 0.8 - 30 ;
    
  const imageAttachments = downloadedAttachments.filter(
    (at) => at.type === "IMAGE"
  );
  const videoAttachments = downloadedAttachments.filter(
    (at) => at.type === "VIDEO"
  );

  return (
    
    <View 
      style={[styles.container, 
        {
          backgroundColor: isMe ? '#DCF8C5' : 'white',
          alignSelf: isMe ? 'flex-end' : 'flex-start'
        }
      ]}
    > 
      {downloadedAttachments.length > 0 && (
        <View style={[{ width: maxContainerWidth}, styles.images]}>
          <ImageAttachment 
            attachments={imageAttachments}/>

          <VideoAttachment 
              width={maxContainerWidth} 
              attachments={videoAttachments}/>
        </View>
      )}
      
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
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 2,
  },
  imageContainer: {
    width: '50%',
    aspectRatio: 1,
    border: 1,
    padding: 3,
  },
  image: {
    flex: 1,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
  }
})

export default Message