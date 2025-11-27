'use client'

import { createDoctor, getDoctors, updateDoctor,getAvailableDoctors} from "@/lib/actions/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useGetDoctors(){
    const result=useQuery({
        queryKey:["getDoctors"],
        queryFn:getDoctors
    })

    return result;
}

export function useCreateDoctor(){
    const queryClient=useQueryClient()
    const result=useMutation({
    mutationFn:createDoctor,
    onSuccess:() => {
        console.log("Doctor Created")
        //invalidate related queries to refresh the data
        queryClient.invalidateQueries({queryKey:["getDoctors"]})

    },
    onError:() => {
        console.log("Error while creating doctor")
    },
    })
return result;
}

export function useUpdateDoctor(){

    const queryClient=useQueryClient();
    const result=useMutation({
        mutationFn:updateDoctor,
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey:["getDoctors"]})
        },
        onError:(error) => console.log("Failed to update doctor:",error)
    })
    return result;

}

export function useAvailableDoctors(){
    const result=useQuery({
        queryKey:["getAvailableDoctors"],
        queryFn:getAvailableDoctors
    })
    return result;
}