import { View, Text,FlatList} from 'react-native'
import { useEffect } from 'react'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import {getUserLikedVideos} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'




const BookMark = () => {
  const {user}=useGlobalContext();
  const {data:posts,refetch}  = useAppwrite(()=>getUserLikedVideos(user.$id));

  useEffect(()=>{
    refetch();

  })
   
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
      data={posts}
      // data={[]}
      keyExtractor={(item)=>item.$id}
      renderItem={({item})=>(
        <VideoCard video={item}/>
  )}     
  
   ListHeaderComponent={()=>(
    <View className="my-6 px-4 ">
          <Text className="font-pmedium  text-xl text-gray-100">
            Saved Videos
          </Text>
          {/* <Text className="text-2xl font-psemibold text-white">
            {query}
          </Text> */}

          <View className="mt-6 mb-8">
          {/* <SearchInput initialQuery={null}/> */}
          </View>
    </View>
    
   )}
    ListEmptyComponent={()=>(
     <EmptyState
     title="No Videos Found"
     subtitle="No video Saved"
     />
    )}
  
      />
    </SafeAreaView>
  )
}

export default BookMark