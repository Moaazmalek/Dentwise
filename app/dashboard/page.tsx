export const dynamic = 'force-dynamic'
import MainActions from '@/components/dashboard/MainActions'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import ActivityOverview from '@/components/dashboard/ActivityOverview'


const Dashboard = () => {

  return (
    <>
      <div className="max-w-7xl mx-auto  px-4 pt-24 pb-58 sm:pb-0">
      <WelcomeSection/>
      <MainActions/>
      <ActivityOverview/>
      </div>
    </>
  )
}

export default Dashboard