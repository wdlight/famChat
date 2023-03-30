import { View, Text, StyleSheet, Image, Pressable, useWindowDimensions } from 'react-native'
import React , { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Auth, Storage } from 'aws-amplify';
import {S3Image} from 'aws-amplify-react-native';
import ImageView from 'react-native-image-viewing';


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
  },[message.Attachments.items])

  const imageContainerWidth = width * 0.8 - 30 ;
  
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
        <View style={[{ width: imageContainerWidth}, styles.images]}>
        {/* //  <S3Image imgKey={message.image[0]} style={styles.image} />  */}
        { downloadedAttachments.map( img => (          
            <Pressable 
              key={img.uri} 
              style={[
                styles.imageContainer,
                downloadedAttachments.length === 1 && {flex:1}
              ]}            
              onPress={()=> {               
                setImageViewerVisible(true);}}>
              <Image             
                source={ {uri: img.uri}} style={styles.image} /> 
            </Pressable>
          
          
        ))}
        

        <ImageView
          images={downloadedAttachments.map( ({uri}) => ({uri}))}
          imageIndex={0}
          visible={imageViewerVisible}
          onRequestClose={()=> { setImageViewerVisible(false)}}
        />
        </View>      
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