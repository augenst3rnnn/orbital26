
import { View, Text, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function HomeScreen() {
  const handleLogout = async()=>{  //use signOut from firebase
    await signOut(auth); //go back welcomescreen
  }
  return (
    <SafeAreaView>
      <Text className="text-lg" >Home Page</Text>
      <TouchableOpacity onPress={handleLogout} className="py-3 bg-yellow-400 rounded-xl">
        <Text className="text-center font-bold text-lg">
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}