import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { icons } from '../constants';
import { Video, ResizeMode } from 'expo-av';
import { useGlobalContext } from '../context/GlobalProvider';
import { getUserLikedVideos, likeVideo, unlikeVideo } from '../lib/appwrite';

const VideoCard = ({ video: { $id, title, thumbnail, videos, creator: { username, avatar } } }) => {
  const [play, setPlay] = useState(false);
  const { user } = useGlobalContext();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!$id || !user || !user.$id) {
      return;
    }
    const checkLiked = async () => {
      try {
        const likedVideos = await getUserLikedVideos(user.$id);
        setLiked(likedVideos.some((v) => v.$id === $id));
      } catch (e) {
        console.error('Error checking liked videos:', e);
      }
    };
    checkLiked();
  }, [user, $id]);

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeVideo(user.$id, $id);
      } else {
        await likeVideo(user.$id, $id);
      }
      setLiked(!liked);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  if (!user || !$id) {
    return null; // Return null or a fallback UI if user or video data is missing
  }

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gapy-1">
            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>

        <View className="pt-2 flex-row">
          <TouchableOpacity onPress={handleLike}>
            <Image
              source={liked ? icons.heart_coloured : icons.heart_outline}
              className="w-5 h-5 border border-secondary rounded-full p-1"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      {play ? (
        <Video
          source={{ uri: videos }}
          className="w-full h-60 rounded-xl mt-3"
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
