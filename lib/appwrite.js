// import { Platform } from "react-native";
import {Account, Avatars, Client, ID,Databases,Query,Storage} from 'react-native-appwrite';


export const Config={
    endpoint:process.env.endpoint,
    Platform:process.env.Platform,
    projectId:process.env.projectId,    
    databaseId:process.env.databaseId,
    userCollectionId:process.env.userCollectionId,
    videoCollectionId:process.env.videoCollectionId,
    storageId:process.env.storageId,
    likedVideoCollectionId:process.env.likedVideoCollectionId,
}
const { endpoint, Platform, projectId,databaseId,userCollectionId,videoCollectionId,storageId,likedVideoCollectionId } = Config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(endpoint) // Your Appwrite Endpoint
    .setProject(projectId) // Your project ID
    .setPlatform(Platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars=new Avatars(client)
const databases=new Databases(client);
const storage=new Storage(client);
export const createUser= async (email,password,username)=>{

    try{
        const newAccount= await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if ( !newAccount ) {
            throw new Error('Account creation failed')
        }

        const avatarUrl=avatars.getInitials(username);
        await signIn(email,password);

        const newUser=await databases.createDocument(
            databaseId,//databaseId
            userCollectionId,//collectionId
            ID.unique(),//documentId
            //data
            {
                accountid:newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
      return newUser;
    }
    catch(e){
        console.log(e);
        throw new Error(e);
    }
}

export const signIn = async (email,password) => {
    try{
        const session=await account.createEmailPasswordSession(email,password);
        return session;
    }
    catch(e){
        console.log(e);
        throw new Error(e);
    }   
}


export const getCurrentUser = async() => {
    try{
        const currentAccount=await account.get();
        if (!currentAccount){
            throw Error;
        }
        const CurrentUser=await databases.listDocuments(
            databaseId,
           userCollectionId,
            [Query.equal('accountid',currentAccount.$id)]
        )
        if (!CurrentUser){
            throw Error;
        }
        return CurrentUser.documents[0];
    }
    catch(error){
        console.log(error);
    }

}


export const getAllPosts = async () => {
    try{
        const post= await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]

        )
        return post.documents;
    }
    catch(e){
        throw new Error(e);
    }
}

export const getLatestPost = async () => {
    try{
        const post= await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]

        )
        return post.documents;
    }
    catch(e){
        throw new Error(e);
    }
}

export const searchPost = async (query) => {
    try{
        const post= await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title',query)]


        )
        return post.documents;
    }
    catch(e){
        throw new Error(e);
    }
}

export const getUserPosts = async (userId) => {
    try{
        const post= await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator',userId)]


        )
        return post.documents;
    }
    catch(e){
        throw new Error(e);
    }
}

export const signOut = async () => {
    try{
      const session= await account.deleteSession('current');

      return session;

    }
    catch(e){
        throw new Error(e);
    }
}

export const getFilePreview = async (fileId,type) => {

    let fileUrl;
    try{
        if(type=='video'){
            fileUrl= storage.getfileView(storageId,fileId)
        }
        else if(type=='image'){
            fileUrl= storage.getFilePreview(storageId,fileId,2000,2000,'top',100)
        }
        else{
            throw new Error('Invalid file type')
        }
    if(!fileUrl){
        throw Error;
    }
    return fileUrl;
    }
    catch(e){
        throw new Error(e);
    }
}

export const uploadFile= async(file,type)=>{
   if(!file) return;

   const assest={
       name:file.fileName,
       type:file.mimeType,
       size:file.fileSize,
       uri:file.uri,
   };
   try{
       const uploadedFile= await storageId.createFile(
        storageId,
        ID.unique(),
        assest
       );
       const fileUrl= await getFilePreview(uploadedFile.$id,type);
   }
   catch(e){
       throw new Error(e);
   }
}

export const createVideo = async (form) => {
    try{
        const [thumbnailUrl,videoUrl]= await Promise.all([

            uploadFile(form.thumbnail,'image'),
            uploadFile(form.video,'video'),

        ])
        const newPost= await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title:form.title,
                thumbnailUrl:thumbnailUrl,
                video:videoUrl,
                prompt:form.prompt,
                creator:form.userId
            }
        )
        return newPost;

    }
    catch(e){
        throw new Error(e);
    }
          


}



export const getUserLikedVideos = async (userId) => {
    try{
        if (!userId){
            return;
        }
        const post= await databases.listDocuments(
            databaseId,
            likedVideoCollectionId,
            [Query.equal('userId',userId)]

        )
        const videoIds = post.documents.map(doc => doc.videoId);
        if (videoIds.length === 0) {
            return;
        }
         const data= await databases.listDocuments(
             databaseId,
             videoCollectionId,
             [Query.equal('$id',videoIds)]
         )
        return data.documents;
    }
    catch(e){
        throw new Error(e);
    }

}

export const likeVideo = async (userId,videoId) => {
    try{
        
        const newLike=await databases.createDocument(
            databaseId,//databaseId
            likedVideoCollectionId,//collectionId
            ID.unique(),//documentId
            //data
            {
                userId:userId,
                videoId:videoId
            }
        )
      return newLike;

    }
    catch(e){
        throw new Error(e);
    }
}

export const unlikeVideo = async (userId,videoId) => {
    try {
        if (!userId || !videoId) {
            throw new Error('Invalid userId or videoId');
        }
        const post = await databases.listDocuments(
            databaseId,
            likedVideoCollectionId,
            [
                Query.equal('userId', userId),
                Query.equal('videoId', videoId)
            ]
        );

        const documentId = post.documents[0].$id;

        await databases.deleteDocument(
            databaseId,
            likedVideoCollectionId,
            documentId
        );

      
    } catch (e) {
        throw new Error(e.message);
    }

}