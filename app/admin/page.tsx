import AdminDashboardClient from '@/components/admin/AdminDashboardClient'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const AdminPage = async() => {
    const user = await currentUser()
    if(!user)redirect("/")
    const adminEmail=process.env.ADMIN_EMAIL;
    const userEmail=user.emailAddresses[0]?.emailAddress
    if(!adminEmail || userEmail !==adminEmail) redirect("/dashboard")
  return (
    <AdminDashboardClient/>
  )
}

export default AdminPage