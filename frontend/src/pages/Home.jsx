import React from 'react'
import NavBar from '../components/NavBar'
import TopUsers from '../components/TopUsers'
import Posts from '../components/Posts'
import BottomNav from '../components/BottomNav'

const Home = () => {
  return (
    <>
      <NavBar/>
      <TopUsers/>
      <Posts/>

      <BottomNav/>
    </>
  )
}

export default Home