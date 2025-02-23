"use client"

import { useState } from "react"
import { PhoneForm } from "./phone-form"
import { CallList } from "./call-list"
import { CallDialog } from "./call-dialog"

export function PhoneCallManager() {
  const [calls, setCalls] = useState([
    { id: 1, name: "John Doe", number: "123-456-7890", date: "2023-05-01" },
    { id: 2, name: "Jane Smith", number: "987-654-3210", date: "2023-05-02" },
    { id: 3, name: "Bob Johnson", number: "555-555-5555", date: "2023-05-03" },
  ])

  const [selectedCall, setSelectedCall] = useState(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <PhoneForm />
      <CallList calls={calls} onCallClick={setSelectedCall} />
      <CallDialog call={selectedCall} onClose={() => setSelectedCall(null)} />
    </div>
  )
}

