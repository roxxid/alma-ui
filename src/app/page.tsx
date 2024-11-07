"use client"

import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from "@/components/ui/label"
import CountrySelect from "@/components/ui/country-select";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react";

export const immigrationFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  linkedIn: z.string().url("Invalid URL"),
  resume: z.any().optional(), // Handle resume as a file input
  visaInterest: z.array(z.string()).nonempty("Select at least one visa category"),
  helpText: z.string().min(4, "Please provide more details"),
});

export type ImmigrationFormSchema = z.infer<typeof immigrationFormSchema>;

export default function ImmigrationForm() {

  const [formSubmitted, setFormSubmitted] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm<ImmigrationFormSchema>({
    resolver: zodResolver(immigrationFormSchema),
  });

  const onSubmit = (data: ImmigrationFormSchema) => {
    console.log("Form data", data);
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center font-[family-name:var(--font-montserrat)]">
      {/* Header Section */}
      <div className="w-full flex flex-col justify-center items-center align-center h-96 bg-[#d9dea5]">
        <div>
          <Image className="mb-12" src="/alma_logo.png" width={75} height={75} alt="Logo" />
          <h1 className="max-w-2xl text-5xl font-extrabold text-[#000]">Get An Assessment Of Your Immigration Case</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-xl w-full bg-white p-8">
        {!formSubmitted ? <form className="mx-auto space-y-6 max-w-sm justify-center" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-center items-center align-center mb-8">
            <Image
              className="align-center mb-6"
              src="/gradient.png"
              width={75}
              height={75}
              alt="Picture of the author"
            />
            <p className="text-xl font-bold text-[#000] mb-4 text-center">
              Want to understand your visa options?
            </p>
            <p className="text-md font-semibold text-[#000] text-center">
              Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.
            </p>
          </div>
          {/* Personal Information Section */}
          <div className="space-y-4 max-w-sm mx-auto">
            <Input placeholder="First Name" {...register("firstName")} />
            <p className="text-red-600">{errors.firstName?.message}</p>

            <Input placeholder="Last Name" {...register("lastName")} />
            <p className="text-red-600">{errors.lastName?.message}</p>

            <Input type="email" placeholder="Email" {...register("email")} />
            <p className="text-red-600">{errors.email?.message}</p>

            <Controller
              name="country"
              control={control}
              render={({ field }) => <CountrySelect {...field} placeholder="Country of Citizenship" />}
            />
            <p className="text-red-600">{errors.country?.message}</p>

            <Input placeholder="LinkedIn / Personal Website URL" {...register("linkedIn")} />
            <p className="text-red-600">{errors.linkedIn?.message}</p>

            <div className="flex items-center gap-1.5">
              <Label htmlFor="resume">Resume</Label>
              <Input type="file" {...register("resume")} id="resume" />
            </div>
          </div>

          {/* Visa Interest Section */}
          <div className="text-center mt-12 mb-4">
            <div className="flex flex-col justify-center items-center">
              <Image
                className="flex self-align justify-center align-center mb-6"
                src="/folder-fav.png"
                width={75}
                height={75}
                alt="Picture of the author"
              />
            </div>
            <h2 className="text-xl font-bold">Visa categories of interest?</h2>
            <div className="flex flex-col space-y-2 mt-4 max-w-sm mx-auto">
              {["O-1", "EB-1A", "EB-2 NIW", "I don’t know"].map((value) => (
                <div key={value} className="flex items-center space-x-3">
                  <Controller
                    name="visaInterest"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field?.value?.includes(value)}
                        onCheckedChange={(isChecked) =>
                          field.onChange(isChecked ? [...(field.value || []), value] : field.value?.filter((v) => v !== value))
                        }
                      />
                    )}
                  />
                  <p className="text-sm font-medium">{value}</p>
                </div>
              ))}
              <p className="text-red-600">{errors.visaInterest?.message}</p>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="text-center mt-8 mb-4">
            <div className="flex flex-col justify-center items-center">
              <Image
                className="flex self-align justify-center align-center mb-6"
                src="/heart.png"
                width={75}
                height={75}
                alt="Picture of the author"
              />
            </div>
            <h2 className="text-xl font-bold mb-6">How can we help you?</h2>
            <Textarea placeholder="Describe your current status, goals, and any timeline considerations" rows={4} {...register("helpText")} />
            <p className="text-red-600">{errors.helpText?.message}</p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-8 bg-black text-white">
            Submit
          </Button>
        </form> :
          <div className="flex flex-col justify-center items-center align-center mb-8">
            <Image
              className="align-center mb-6"
              src="/gradient.png"
              width={75}
              height={75}
              alt="Picture of the author"
            />
            <p className="text-xl font-bold text-[#000] mb-4 text-center">
              Thank You
            </p>
            <p className="text-md font-semibold text-[#000] text-center">
              Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai.
            </p>
          </div>}
      </div>
    </div>
  );
}