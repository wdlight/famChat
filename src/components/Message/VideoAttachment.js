import { View, Text } from 'react-native'
import React from 'react'
import { Video } from "expo-av";

const VideoAttachment = ({attachments, width}) => {
  return (
    <>
      { attachments.map ( attachment => (
      <Video
        key={attachment.uri}
        useNativeControls
        source = {{ uri: attachment.uri}}
        shouldPlay={false}
        style={{
          width: width,
          height:
            (attachment.height * width) / attachment.width,
        }}
        resizeMode="contain"
      />    
      ))}
    </>
    
    
  )
}

export default VideoAttachment