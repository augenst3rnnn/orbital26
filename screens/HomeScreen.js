
import { View, Text, TouchableOpacity,Image, StatusBar, ScrollView, TextInput} from 'react-native';
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
    <SafeAreaView className="flex-1 bg-white">
      <View className='flex-1 bg-white'>
        <StatusBar style="dark" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 50}}
          className="space-y-6 pt-2"
        >
        
        {/*avatar and bell icon*/}
        <View className="px-4 flex-row justify-between items-center mb-2">
          <Image source={require('../assets/images/avatar.png')} style={{height: 50, width: 50}} />
          <Image source={require('../assets/images/bell.png')} style={{height: 30, width: 30}} />
        </View>

        {/*greetings*/}
        <View className="mx-4 space-y-2 mb-2">
          <Text style={{fontSize: 20, fontWeight: "bold"}}>Good morning {userData ? userData.displayName : "User"}!</Text>
          <Text style={{fontSize: 30}} className="font-semibold text-neutral-600 mt-1">What would you like to cook today?</Text>
        </View>

        {/*search bar*/}
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder='Search any recipes'
            placeholderTextColor={'gray'}
            className="flex-1 text-base mb-1 pl-2"
          />
          <View className="bg-white rounded-full p-3">
            <Image source={require('../assets/images/search.png')} style={{height: 20, width: 20}} />
          </View>
        </View>
        </ScrollView>  
      </View>  

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