import axios from "axios"; 
import { useAuth } from '@/src/context/AuthContext';


const axiosInstanceUtility = axios.create({
  baseURL : import.meta.env.VITE_API_URL,

  withCredentials: true,
  
});

export default axiosInstanceUtility;