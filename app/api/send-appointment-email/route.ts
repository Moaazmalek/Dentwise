import AppointmentConfirmationEmail from "@/components/emails/AppointmentConfirmationEmail";
import resend from "@/lib/resend";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(request:Request){

    const user=await currentUser();
    if(!user){
        return NextResponse.json({error:"Not authenticated"},{status:401})
    }
    try {
        const body=await request.json();
        const {userEmail
            ,doctorName,
            appointmentDate,
            appointmentTime,
            appointmentType,
            duration,
            price
        }=body
        
        if(!userEmail || !doctorName || !appointmentDate || !appointmentTime){
            return NextResponse.json({error:"Missing requried fields"},{status:400});  
        }
        const {data,error}=await resend.emails.send({
            from:"Dentwise <no-reply@resend.dev>",//only for testing 
            to:[userEmail],
            subject:"Appointment Confirmation - DentWise",
            react:AppointmentConfirmationEmail({
                name:`${user.firstName} ${" "} ${user.lastName}`,
                doctorName,
                appointmentDate,
                appointmentTime,
                appointmentType,
                duration,
                price
            })
            
        });

            if(error){
                console.log("Resend error:",error);
                return NextResponse.json({error:"Failed to send email"},{status:500});
            }
            return NextResponse.json({
                message:"Email sent successfully",
                emailId:data?.id,
               
            },{status:200})
    } catch (error) {
        return NextResponse.json({error:"Internal server error"},{status:500})
    }
}