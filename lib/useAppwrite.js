import { isLoaded, isLoading } from "expo-font";
import { useState,useEffect } from "react";
import { Alert } from "react-native";

const useAppwrite=(fn)=>{

    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(true);
    const fetchData = async () => {
        setLoading(true);
        try{
          const res= await fn();
          setData(res);
        }
        catch(e){
          Alert.alert('Error',e.message)
        }
        finally{
            setLoading(false)
        }
   }

    useEffect(()=>{
      
       fetchData()
    },[])

    const refetch=()=>{
        fetchData();
    }
  
    return {data,isLoading,refetch}
}
export default useAppwrite;