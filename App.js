import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import ChatListItem from './src/components/ChatListItem';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';
import Navigator from './src/navigation';


export default function App() {
  return (
    <View style={styles.container}>
      {/* <ChatListScreen /> */}
      {/* <ChatScreen /> */}
      <Navigator/>
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
    paddingVertical: 10, // for notch.
  },
});
