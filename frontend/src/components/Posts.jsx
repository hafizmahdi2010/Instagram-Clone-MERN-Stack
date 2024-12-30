import React, { useEffect } from 'react'
import { HiDotsVertical } from "react-icons/hi";
import { FaHeart, FaRegBookmark, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Posts = () => {

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const getPosts = () => {
    fetch(api_base_url + "/getPosts", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setData(data.data);
      }
      else {
        toast.error(data.msg);
      }
    })
  };

  const toggleLike = (id) => {
    fetch(api_base_url + "/toggleLike", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        postId: id
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        getPosts();
      }
      else {
        toast.error(data.msg);
      }
    })
  };

  useEffect(() => {
    getPosts();
  }, [])

  return (
    <>
      <div className="Posts mt-5 pb-[60px]">

        {
          data ? data.map((item, index) => {
            return (
              <>
                <div key={index} className="post mb-2">
                  <div className="flex px-[10px] items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <img onClick={()=>{navigate(`/profile/${item.user._id}`)}} className='w-[40px] h-[40px] rounded-[50%] object-cover' src="https://th.bing.com/th/id/OIG1.wQ7nqzXG6LLji1s3MrOP" alt="" />
                      <div>
                        <p>{item.user.username}</p>
                        <p className='text-[13px] text-[gray] -mt-1'>Join In {new Date(item.user.date).toDateString()}</p>
                      </div>
                    </div>

                    <i className='text-[20px] cursor-pointer'><HiDotsVertical /></i>
                  </div>

                  <img className='mt-4 w-full h-auto' src={api_base_url + "/uploads/"+item.post.image} alt="" />

                  <div className='px-[10px]'>

                    <div className="flex mt-3 items-center justify-between">
                      <div className="flex items-center gap-[15px]">
                        <i onClick={()=>{toggleLike(item.post._id)}} className={`text-[20px] cursor-pointer ${item.post.isYouLiked === true ? "text-pink-600" : ""}`}>{item.post.isYouLiked === true ? <FaHeart /> : <FaRegHeart />}</i>
                        <i className='text-[20px] cursor-pointer'><FaRegComment /></i>
                        <i className='text-[20px] cursor-pointer'><FiSend /></i>
                      </div>
                      <i className='text-[20px] cursor-pointer'><FaRegBookmark /></i>
                    </div>
                    <p className='my-2 text-[14px] text-[gray]'>{item.post.likes} Likes</p>

                    <p className='text-[14px] text-[gray]'><b className='text-[#fff]'>{item.user.username} </b> {item.post.caption}</p>
                  </div>
                </div>
              </>
            )
          }) : ""
        }

      </div>
    </>
  )
}

export default Posts