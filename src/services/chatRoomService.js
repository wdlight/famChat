import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { API, graphqlOperation, Auth } from 'aws-amplify'


export const getMyChatRooms = async ( userID) => {
  const authUser = await Auth.currentAuthenticatedUser();

  
  const response = await API.graphql(
    graphqlOperation( listMyChatRooms, { id: authUser.attributes.sub})
  );
  
  const myChatRooms = response.data?.getUser?.ChatRooms?.items || [];
  
  //get all chat room of user1ID
  const chatRoom = myChatRooms.find( (item) => {
    return 
      // item.chatRoom.users.items.length === 2 &&
      item.chatRoom.users.items.some(
      (userItem) => userItem.user.id === userID )
  })
  // get all chat rooms of user2
  // remove chat rooms with more than 2users
  // get the common chat rooms

  return chatRoom;
  
}

export const listMyChatRooms = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      ChatRooms {
        items {
          chatRoom {
            id
            users {
              items {
                user {
                  id          
                }
              }
            }          
          }
        }
      }
    }
  }
`;
