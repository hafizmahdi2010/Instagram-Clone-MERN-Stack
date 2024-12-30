import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import BottomNav from '../components/BottomNav'
import { toast } from 'react-toastify';
import { api_base_url } from '../helper';

const Create = () => {

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const create = () => {
    if (caption === "" || image === "") {
      toast.error("Please fill all the fields")
    }

    let formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    formData.append("token", localStorage.getItem("token"))

    fetch(api_base_url + "/createPost", {
      mode: "cors",
      method: "POST",
      body: formData
    }).then(res => res.json()).then(data => {
      if (data.success) {
        toast.success("Post Created Successfully... !")
      }
      else {
        toast.error(data.msg)
      }
    })
  }

  return (
    <>
      <NavBar />
      <div className="create px-[10px]">
        <h1 className='text-xl mb-5'>Create</h1>
        <input onChange={(e) => { setImage(e.target.files[0]) }} type="file" id='file' required />
        <div className="inputBox mt-4">
          <textarea onChange={(e) => { setCaption(e.target.value) }} value={caption} placeholder='Caption' required></textarea>
        </div>
        <button className="btnNormal w-full mt-2" onClick={create}>Create</button>
      </div>

      <BottomNav />
    </>
  )
}

export default Create