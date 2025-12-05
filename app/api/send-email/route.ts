import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import type { ReactNode } from "react";
import AppointmentConfirmationEmail from "@/components/emails/AppointmentConfirmationEmail";

import { currentUser } from "@clerk/nextjs/server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const {
      userEmail,
      doctorName,
      appointmentDate,
      appointmentTime,
      appointmentType,
      duration,
      price,
    } = await request.json();
    if (!userEmail || !doctorName || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: "Missing requried fields" },
        { status: 400 }
      );
    }
    const emailHtml = await render(
      AppointmentConfirmationEmail({
        doctorName,
        appointmentDate,
        appointmentTime,
        appointmentType,
        duration,
        price,
         name:`${user.firstName} ${" "} ${user.lastName}`,
      }) as ReactNode
    );
    
    const mailOptions={
        from:process.env.GMAIL_USER,
        to:userEmail,
        subject:"Appointment Confirmation - DentWise",
        html:emailHtml
    }

    const info=await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`)
    return NextResponse.json({message:"Email sent successfully",messageId:info.messageId},{status:200})
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
