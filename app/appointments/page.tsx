"use client";

import { AppointmentConfirmationModal } from "@/components/appointments/AppointmentConfirmationModal";
import BookingConfirmationStep from "@/components/appointments/BookingConfirmationStep";
import DoctorSelectionStep from "@/components/appointments/DoctorSelectionStep";
import ProgressSteps from "@/components/appointments/ProgressSteps";
import TimeSelectionStep from "@/components/appointments/TimeSelectionStep";
import Navbar from "@/components/Navbar";
import { useBookAppointment, useUserAppointments } from "@/hooks/use-appointments";
import { APPOINTMENT_TYPES } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import {toast} from 'sonner'
const AppointmentsPage = () => {
  const [selectedDentisitId, setSelectedDentisitId] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentStep, setCurrentStep] = useState(1); //1:select dentist, 2: select time, 3: confirm

  //conform
  const [showConfirmationModal, setshowConfirmationModal] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null); //eslint-disable-line @typescript-eslint/no-explicit-any

  const bookAppointmentMutation = useBookAppointment();

  const {data:userAppointments=[]}=useUserAppointments();
  const handleSelectDentist = (dentistId: string) => {
    setSelectedDentisitId(dentistId);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedType("");
  };
  const handleBookedAppointment = async () => {
     if (!selectedDentisitId || !selectedDate || !selectedTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    const appointmentType=APPOINTMENT_TYPES.find((t) => t.id===selectedType);
    bookAppointmentMutation.mutate({
        doctorId:selectedDentisitId,
        date:selectedDate,
        time:selectedTime,
        reason:appointmentType?.name
    },{
        onSuccess:async(appointment) => {
            setBookedAppointment(appointment);
            //todo send email using resend

            //show the success modal
            setshowConfirmationModal(true);
            //reset form
            setSelectedDentisitId(null);
            setSelectedDate("");
            setSelectedTime("");
            setSelectedType("");
            setCurrentStep(1);
            
        },
        onError:(error) => {
            toast.error(`Failed to book appointment: ${error.message}`);
        }
    }
)
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-4 overflow-x-hidden">
        {/**Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
          <p className="text-muted-foreground">
            Find and book with verified dentists in your area
          </p>
        </div>
        {/**Progress steps component */}
        <ProgressSteps currentStep={currentStep} />
        {currentStep === 1 && (
          <DoctorSelectionStep
            selectedDentistId={selectedDentisitId}
            onContinue={() => setCurrentStep(2)}
            onSelectDentist={handleSelectDentist}
          />
        )}
        {currentStep === 2 && selectedDentisitId && (
          <TimeSelectionStep
            selectedDentistId={selectedDentisitId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedType={selectedType}
            onBack={() => setCurrentStep(1)}
            onContinue={() => setCurrentStep(3)}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onTypeChange={setSelectedType}
          />
        )}
        {currentStep === 3 && selectedDentisitId && (
            <BookingConfirmationStep
                selectedDentistId={selectedDentisitId}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedType={selectedType}
                isBooking={bookAppointmentMutation.isPending}
                onBack={() => setCurrentStep(2)}
                onModify={() => setCurrentStep(2)}
                onConfirm={handleBookedAppointment}
            />
        )}


      </div>

      {/**Confirmation modal */}
      {bookedAppointment && (
        <AppointmentConfirmationModal
          open={showConfirmationModal}
          onOpenChange={setshowConfirmationModal}
          appointmentDetails={{
            doctorName: bookedAppointment.doctorName,
            appointmentDate: format(new Date(bookedAppointment.date), "EEEE, MMMM d, yyyy"),
            appointmentTime: bookedAppointment.time,
            userEmail: bookedAppointment.patientEmail,
          }}
        />
      )}
      {/**Show existing appointments for the current user */}
      {userAppointments.length > 0 && (
        <div className="mb-8 max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-xl font-semibold mb-4">Your Upcoming Appointments</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Image
                      src={appointment.doctorImageUrl}
                      alt={appointment.doctorName}
                      className="size-10 rounded-full"
                      width={48}
                        height={48}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{appointment.doctorName}</p>
                    <p className="text-muted-foreground text-xs">{appointment.reason}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    📅 {format(new Date(appointment.date), "MMM d, yyyy")}
                  </p>
                  <p className="text-muted-foreground">🕐 {appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsPage;
