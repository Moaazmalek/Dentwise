/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { Gender } from "@/app/generated/prisma/enums";
import prisma from "../prisma"
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";

export async function getDoctors() {
    try {
        const doctors=await prisma.doctor.findMany({
            include:{
                _count:{select:{appointments:true}}
            },
            orderBy:{
                createdAt:"desc"
            },
            
        });
        return doctors.map((doctor) => ({
            ...doctor,
            appointmentCount:doctor._count.appointments
        }))

        
    } catch (error) {
        console.log("Error fetching doctors",error)
        throw new Error("Failed to fetch doctors")
        
    }
    
}

export interface CreateDoctorInput {
    name:string;
    email:string;
    phone:string;
    speciality:string;
    gender:Gender;
    isActive:boolean
    
}
interface UpdateDoctorInput extends Partial<CreateDoctorInput> {
    id:string;

}

export async function createDoctor(input:CreateDoctorInput) {
    try {
        if(!input.name ||
            !input.email
        ){
            throw new Error("Name and email are required") 
        }
        const doctor=await prisma.doctor.create({
           data:{
            ...input,
            imageUrl:generateAvatar(input.name,input.gender)
           }
        })
        //give you the latest data after adding a doctor
        revalidatePath("/admin")

        return doctor;
    } catch (error:any) {
        if(error?.code==="P2002") throw new Error("A doctor with this email already exists")
        console.log("Failed creating a doctor",error)
        throw new Error("Failed create a doctor!")
        
    }
}

export async function updateDoctor(input:UpdateDoctorInput) {

    try {
        //validate
         if(!input.name || !input.email) throw new Error("Name and Email are required")
            const currentDoctor=await prisma.doctor.findUnique({
        where:{id:input.id}
    ,select:{
        email:true

    }

})
        
if(!currentDoctor) throw new Error("Doctor not found")
//If email is changing check if the new email already exists
  if(input.email !==currentDoctor.email){
    const existingDoctor=await prisma.doctor.findUnique({
        where:{
            email:input.email
        }
    });
    if(existingDoctor){
        throw new Error("A doctor with this email is already exists")
    }

  }

  const doctor=await prisma.doctor.update({
    where:{
        id:input.id
    },
    data:{
        name:input.name,
        email:input.email,
        phone:input.phone,
        speciality:input.speciality,
        gender:input.gender,
        isActive:input.isActive


    }
    
  })
  return doctor
  

    } catch (error) {
        throw new Error("Failed udpdate a doctor")
        
    }
}