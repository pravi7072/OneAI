import React, { useState } from 'react'
import { Hash, Sparkle } from 'lucide-react';
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

const blogCategory = [
  'General', 'Technology', 'Business', 'Health',
  'Lifestyle', 'Education', 'Travel', 'Food'
];

const BlogTitles = () => {
  // Correct: use blogCategory[0] for initial selected category.
  const [selectedCategory, setSelectedCategory] = useState(blogCategory[0]);
  const [input, setInput] = useState("");
  const [loading,setLoading]=useState(false);
  const [content,setContent]=useState('')
  
  const {getToken}=useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // You can add your title generation logic here
    try {
      setLoading(true)
      const prompt=`Generate a blog title for the keyword ${input} in the category ${selectedCategory}`
      const {data}=await axios.post('/api/ai/generate-blog-title',{prompt},
        {
          headers:{Authorization:`Bearer ${await getToken()}`}
        }
      )
      if(data.success){
        setContent(data.content)
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex flex-wrap gap-4 text-slate-700 items-start">
      {/* left col */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkle className="w-6 h-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          
          required
        />

        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {blogCategory.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item ? 'bg-purple-50 text-purple-700 border-purple-200' : 'text-gray-500 border-gray-300'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >{
          loading ? <span className='w-4 h-4 my-1 rounded-full border-2
              border-t-transparent animate-spin'></span>:
              <Hash className="w-5 h-5" />
        }
          Generate Title
        </button>
      </form>
      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>
        {
          !content ? (<div className="flex-1 flex justify-center items-center gap-5 text-gray-400">
          <Hash className="w-9 h-9" />
          <p>Enter a topic and click "Generate Title" to get started</p>
        </div>):(
            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
                <div className='reset-tw'>
                  <Markdown>
                    {content}
                  </Markdown>
                </div>
            </div>
          )
        }
        
      </div>
    </div>
  );
};

export default BlogTitles;
