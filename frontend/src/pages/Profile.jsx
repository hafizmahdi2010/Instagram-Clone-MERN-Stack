import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import Avatar from 'react-avatar';
import BottomNav from '../components/BottomNav';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {

  let { id } = useParams();

  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isYouFollowed, setIsYouFollowed] = useState(false);

  const getUserDetails = () => {
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: id,
        token: localStorage.getItem("token")
      })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        setUserDetails(data.data);
        setIsYouFollowed(data.data.isYouFollowed);
      }
      else {
        toast.error(data.msg);
      }
    })
  };

  const getMyPosts = () => {
    fetch(api_base_url + "/getMyPosts", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: id,
        token: localStorage.getItem("token")
      })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        setPosts(data.data);
      }
      else {
        toast.error(data.msg);
      }
    })
  };

  const toggleFollow = () => {
    fetch(api_base_url + "/toggleFollow", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: id,
        token: localStorage.getItem("token")
      })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        toast.success(`${data.action} Successfully !`);
        setIsYouFollowed(data.action === "Follow" ? true : false);
      }
      else {
        toast.error(data.msg);
      };
    });
  }

  useEffect(() => {
    getUserDetails();
    getMyPosts();
  }, [])

  return (
    <>
      <NavBar />
      <div className="flex px-[10px] items-center gap-[15px]">
        <Avatar name={userDetails ? userDetails.username : ""} round="50%" className='cursor-pointer' />
        <div>
          <h3>{userDetails ? userDetails.username : ""}</h3>
          <p className='text-[14px] text-[gray]'>Join In {userDetails ? new Date(userDetails.date).toDateString() : ""}</p>
          <p className='text-[14px] text-[gray]'><b>{userDetails ? userDetails.followers : ""}</b> Followers | <b>{userDetails ? userDetails.posts : ""}</b> Posts</p>
          {
            userDetails
              ? userDetails.isThisYou == false ? <button className={`btnNormal mt-3 w-full !p-[5px] text-[14px] ${isYouFollowed ? "!bg-red-500" : ""}`} onClick={toggleFollow}>{isYouFollowed ? "Un Follow" : "Follow"}</button> : "" : ""
          }
        </div>

      </div>
      <div className="posts mt-6">
        {
          posts && posts.length > 0 ? posts.map((post, index) => {
            return (
              <>
                <div key={index} className="post w-[100%] h-[100px]">
                  <img className='w-[30vw] h-full object-cover' src={api_base_url + "/uploads/" + post.image} alt="" />
                </div>
              </>
            )
          }) : "No Posts Found !"
        }
      </div>

      <BottomNav />
    </>
  )
}

export default Profile