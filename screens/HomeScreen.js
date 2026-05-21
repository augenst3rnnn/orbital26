
import { View, Text, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import useAuth from '../config/hooks/useAuth';
import { getUserProfile } from '../config/firestoreService';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const profile = await getUserProfile(user.uid);
      setUserData(profile);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
    

  const handleLogout = async()=>{  //use signOut from firebase
    await signOut(auth); //go back welcomescreen
  };

  return (
    <SafeAreaView>
      <Text className="text-lg" >Home Page</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : userData ? (
        <View className="mt-6 bg-gray-100 p-4 rounded-lg">
          <Text className="text-lg font-semibold">Name: {userData.displayName}</Text>
          <Text className="text-lg mt-2">Email: {userData.email}</Text>
        </View>
      ) : (
        <Text className="text-lg mt-4">No user data found</Text>
      )}

      <TouchableOpacity onPress={handleLogout} className="py-3 bg-yellow-400 rounded-xl">
        <Text className="text-center font-bold text-lg">
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}