import {auth, currentUser} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'


const ADMIN_EMAIL=process.env.ADMIN_EMAIL;

export async function GET(){
    const user=await currentUser();
    if(!user){
        return NextResponse.json({isAdmin:false})
    }
    const userEmail=user.emailAddresses[0]?.emailAddress;
    const isAdmin=userEmail===ADMIN_EMAIL;
    return NextResponse.json({isAdmin})
}