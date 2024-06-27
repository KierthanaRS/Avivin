import { View, Text,ScrollView,Image,Alert } from 'react-native'
import React from 'react'
import { Link,router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState,useEffect } from 'react'
import {images} from '../../constants'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
  const [form,setForm] = useState({
    email:'',
    password:''
  })
  const [isSubmitting,setIsSubmitting]=useState(false);
  const {user,setUser,setIsLoggedIn}=useGlobalContext()



  const submit= async () => {
    if (form.email==="" || form.password==="") {
       Alert.alert('Error','Please fill all fields')
    }
    setIsSubmitting(true)
    try{
     await signIn(form.email,form.password);
    const result=await getCurrentUser();
    setUser(result);
    setIsLoggedIn(true);
    Alert.alert('Success','Logged in successfully')
  
     router.replace('/home')
    }
    catch(e){
      Alert.alert('Error',e.message)
    }
    finally{
      setIsSubmitting(false)
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View classname="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
          source={images.logo}
          className="w-[135px] h-[55px] ml-[10px] mt-[100px] "
          resizeMode='contain'/>
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold ml-2">Log in to Avivin</Text> 
          <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e)=>setForm({...form,email:e})}
          otherStyles="mt-7 ml-3 mr-3"
          keyboardType="email-address"
          />

          <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e)=>setForm({...form,password:e})}
          otherStyles="mt-7 ml-3 mr-3"
         />

         <CustomButton
         title="Sign In"
         handlePress={submit}
         containerStyles="mt-10 ml-3 mr-3"
         isLoading={isSubmitting}
         />
         <View className="justify-center pt-5 flex-row gap-2">
          <Text className="text-gray-100 text-lg font-pregular">Don't have account?</Text>
          <Link className="text-secondary text-lg font-psemibold" href="/sign-up">SignUp </Link>
         </View>
        </View>
      </ScrollView>
      
    </SafeAreaView>
  )
}

export default SignIn