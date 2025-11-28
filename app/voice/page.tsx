import Navbar from '@/components/Navbar'
import FeatureCard from '@/components/voice/FeatureCard'
import PropPlanRequired from '@/components/voice/PropPlanRequired'
import VapiWidget from '@/components/voice/VapiWidget'
import WelcomeSection from '@/components/voice/WelcomeSection'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const VoicePage =async () => {
    const {has}=await auth()
    //Check user plan
    const hasProPlan=has({plan:"ai_basic"})||has({plan:"ai_pro"})
    // if(!hasProPlan){
    //    return <PropPlanRequired/>
    // }
    
  return <div className='min-h-screen bg-background'>
    <Navbar/>
    <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
            <WelcomeSection />
            <FeatureCard/>

    </div>
    <VapiWidget/>
  </div>
}

export default VoicePage