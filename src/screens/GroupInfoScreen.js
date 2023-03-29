import { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { API, graphqlOperation } from "aws-amplify";
import { onUpdateChatRoom } from "../graphql/subscriptions";
import { deleteUserChatRoom } from "../graphql/mutations";
import ContactListItem from "../components/ContactListItem";

const ChatRoomInfo = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false); // Add state variable

  const route = useRoute();
  const navigation = useNavigation();

  const chatroomID = route.params.id;
  console.log ( "ChatroomID : 🐓🐓", chatroomID )

  const fetchChatRoom = async () => {
    setLoading(true);
    const result = await API.graphql(
      graphqlOperation(getChatRoom, { id: chatroomID })
    );
    setChatRoom(result.data?.getChatRoom);
    console.log ( "fetchChatRoom -- 🍌🍌🍌🍌")
    setLoading(false);
  };

  useEffect(() => {
    fetchChatRoom();

    // Subscribe to onUpdateChatRoom
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatroomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
        console.log ( " 🍎🍎 : onUpdateChatRoom passing-- next: ")
      },
      error: (error) => console.warn(error),
    });

    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe();
  }, [chatroomID, isUpdated]);



  const removeChatRoomUser = async (chatRoomUser) => {
    await API.graphql( graphqlOperation( 
      deleteUserChatRoom, 
      {input: { _version: chatRoomUser._version, id: chatRoomUser.id}}));
    setIsUpdated((prev) => !prev)
  }

  const onContactPress = (chatRoomUser) => {
    Alert.alert(
      "Removing the user", 
      `Are you sure you want to remove ${chatRoomUser.user.name} from this group `,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeChatRoomUser(chatRoomUser);
          }
        },
      ]
    
    );
  }

  if (!chatRoom) {
    return <ActivityIndicator />;
  }
  
  console.log ( "  🍊🍊🍊🍊users without deleted ..")
  const users = chatRoom.Users.items.filter((item) => !item._deleted);
  console.log ( " users without deleted .. 🍊🍊🍊🍊")
  console.log ( users )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{chatRoom.name}</Text>

      <Text style={styles.sectionTitle}>
        {users.length} Participants
      </Text>
      <View style={styles.section}>
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <ContactListItem user={item.user} onPress={()=>onContactPress(item)}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 10,
  },
});

export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      updatedAt
      name
      Users {
        items {
          id
          chatRoomId
          userId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          user {
            id
            name
            status
            image
          }
        }
        nextToken
        startedAt
      }
      createdAt
      _version
      _deleted
      _lastChangedAt
      chatRoomLastMessageId
    }
  }
`;

export default ChatRoomInfo;