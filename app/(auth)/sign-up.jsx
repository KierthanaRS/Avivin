import { View, Text,ScrollView,Image,Alert } from 'react-native'
import React from 'react'
import { Link, router  } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState,useEffect } from 'react'
import {images} from '../../constants'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
  const [form,setForm] = useState({
    username:'',
    email:'',
    password:''
  })
  const {user,setUser,setIsLoggedIn}=useGlobalContext()

  const [isSubmitting,setIsSubmitting]=useState(false);

  const submit= async () => {
    if (!form.username || !form.email || !form.password) {
       Alert.alert('Error','Please fill all fields')
    }
    setIsSubmitting(true)
    try{
     const result=await createUser(form.email,form.password,form.username);
     setUser(result);
     setIsLoggedIn(true);


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
        <View classname="w-full justify-center min-h-[85vh] px-4 my-6 mx-5">
          <Image
          source={images.logo}
          className="w-[135px] h-[55px] ml-[10px] mt-[100px] "
          resizeMode='contain'/>
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold ml-2">Sign Up to Avivin</Text> 
          
          <FormField
          title="User Name"
          value={form.username}
          handleChangeText={(e)=>setForm({...form,username:e})}
          otherStyles="mt-10 ml-3 mr-3"
          
          />

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
         title="Sign Up"
         handlePress={submit}
         containerStyles="mt-10 ml-3 mr-3"
         isLoading={isSubmitting}
         />
         <View className="justify-center pt-5 flex-row gap-2">
          <Text className="text-gray-100 text-lg font-pregular">Have an account already?</Text>
          <Link className="text-secondary text-lg font-psemibold" href="/sign-in">SignIn </Link>
         </View>
        </View>
      </ScrollView>
      
    </SafeAreaView>
  )
}

export default SignUp