"use client"

import { useState } from "react"
import Info from "@/app/venue/location/create/Info";
import Contact from "@/app/venue/location/create/Contact";
import Media from "@/app/venue/location/create/Media";
import LocationVerify from "@/app/venue/location/create/LocationVerify";


const steps = [Info, Contact, Media, LocationVerify]
export default function CreatePage() {
  const [step, setStep] = useState(1)

 type FormData = {
  name: string
  description: string
  email: string
  type: "giải trí" | "ăn uống" | "vui chơi" | "khác"
  mood: "Thư giãn" | "Lãng mạn" | "Thân mật" | "Ấm cúng" | "Năng động" | "Yêu thương"
}
const [formData, setFormData] = useState<FormData>({
  name: "",
  description: "",
  email: "",
  type: "giải trí",
  mood: "Thư giãn",
})

  const CurrentStep = steps[step - 1]

  function nextStep() {
    if (step < steps.length) setStep((s) => s + 1)
  }

  function prevStep() {
    if (step > 1) setStep((s) => s - 1)
  }

  function handleSubmit() {
    // chỗ này bạn gọi API hoặc console.log(formData)
    console.log("Submit data:", formData)
  }

  return (
    <div>
      <p className="text-blue-900 mb-4 text-center">
        Bước {step} / {steps.length}
      </p>

      <CurrentStep
        formData={formData}
        setFormData={setFormData}
      />

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 1}
          className="rounded-[8.33] border border-[#D3D6FF] bg-white px-6 py-2 text-sm font-medium text-[#4C5A8F] disabled:opacity-50"
        >
          Trở về
        </button>

        {step === steps.length ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-[8.33] bg-[#9f5ff2] px-8 py-2 text-sm font-semibold text-white hover:bg-[#b28bff]"
          >
            Hoàn tất
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="rounded-[8.33] bg-[#9f5ff2] px-8 py-2 text-sm font-semibold text-white hover:bg-[#b28bff]"
          >
            Tiếp tục
          </button>
        )}
      </div>

    </div>
  )
}
