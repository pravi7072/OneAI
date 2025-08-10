import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;
const Community = () => {
  const [Creation, setCreation] = useState([])
  const { user } = useUser()
  const [loading,setLoading]=useState(true);
  const {getToken}=useAuth();
  const fetchCreation = async () => {
    try {
      const {data} =await axios.get('/api/user/get-published-creations',{
        headers:{Authorization:`Bearer ${await getToken()}`}
      })

      if(data.success){
        setCreation(data.creations)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false);
  }
  const imageLikeToggle=async (id)=>{
    try {
      const {data} =await axios.post('/api/user/toggle-like-creation',{id},{
        headers:{Authorization:`Bearer ${await getToken()}`}
      })
      if(data.success){
        toast.success(data.message)
        await fetchCreation()
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreation()
    }
  }, [user])

  return !loading ? (
    <div className="flex-1 h-full p-4 sm:p-6 overflow-y-auto">
      {/* Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
      <h1 className='text-xl font-medium pb-2'>
        Creations
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Creation.map((creation, index) => (
          <div
            key={index}
            className="relative group w-full"
          >
            {/* Image */}
            <img
              src={creation.content}
              alt="creation"
              className="w-full h-64 object-cover rounded-lg"
            />

            {/* Overlay */}
            <div
              className="absolute inset-0 flex flex-col justify-end items-end
                p-3 rounded-lg transition-all duration-300
                group-hover:bg-gradient-to-b from-transparent to-black/80 text-white"
            >
              <p className="text-sm mb-2 hidden group-hover:block w-full">
                {creation.prompt}
              </p>
              <div className="flex gap-1 items-center">
                <p>{creation.likes.length}</p>
                <Heart
                  onClick={()=>{
                    imageLikeToggle(creation.id)
                  }}
                  className={`w-5 h-5 hover:scale-110 cursor-pointer transition-transform ${
                    creation.likes.includes(user.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <span className='w-10 h-10 my-1 rounded-full border-3
       border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community
