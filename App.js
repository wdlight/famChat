import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import ChatListItem from './src/components/ChatListItem';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <ChatListScreen /> */}
      <ChatScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',    
    justifyContent: 'center',
    alignItems: "stretch",
    paddingVertical: 50, // for notch.
  },
});
