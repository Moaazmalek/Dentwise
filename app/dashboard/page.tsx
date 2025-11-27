import MainActions from '@/components/dashboard/MainActions'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import Navbar from '@/components/Navbar'
import React from 'react'
import ActivityOverview from '@/components/dashboard/ActivityOverview'

const Dashboard = () => {
  return (
    <>
      <Navbar/>
      <div className="max-w-7xl mx-auto px-6 pt-24">
      <WelcomeSection/>
      <MainActions/>
      <ActivityOverview/>
      </div>
    </>
  )
}

export default Dashboard