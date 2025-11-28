import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { currentUser } from '@clerk/nextjs/server'

const Header = async () => {
  const user=await currentUser();
  return (
    <nav className=' fixed inset-0 z-50 px-6 py-2 border-b border-border/50 bg-background/80 backdrop-blur-md h-16'>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href={"/"} className='flex items-center gap-2'>
          <Image src={"/tooth_logo.png"} alt='DentWise Logo' width={32} height={32}
          className='w-11' />
          <span className='font-semibold text-lg'>DentWise</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href='#how-it-works' className='text-muted-foreground hover:text-foreground'>How it Works </a>
          <a href='#pricing-section' className='text-muted-foreground hover:text-foreground'>Pricing </a>
          <a href='#' className='text-muted-foreground hover:text-foreground'>About </a>
         {user &&  <Link href={"/dashboard"} className='text-muted-foreground hover:text-foreground'>Dashboard</Link>}
        </div>
       <SignedOut>
         <div className="flex items-center gap-3">
          <SignInButton mode='modal'>
           <Button variant="ghost" size="sm">
             Login
           </Button>
          </SignInButton>
          <SignUpButton mode='modal'>
           <Button size="sm">
             Sign Up
           </Button>
          </SignUpButton>
        </div>
       </SignedOut>
          <SignedIn>
            <SignOutButton >
             <Button variant={"default"}>
               Sign out 
             </Button>
            </SignOutButton>
          </SignedIn>
      </div>

    </nav>
  )
}

export default Header