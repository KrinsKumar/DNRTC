"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CallDialog } from "./call-dialog"

const MOCK_CALLS = [
  { id: 3, name: "Bob Johnson", number: "555-555-5555", date: "2025-01-21", explaination: "fraud" },
  { id: 2, name: "Jane Smith", number: "987-654-3210", date: "2025-01-20", explaination: "fraud" },
  { id: 1, name: "John Doe", number: "123-456-7890", date: "2025-01-19", explaination: "fraud" },
]

export function CallList() {
  const [selectedCall, setSelectedCall] = useState(null)
  const [calls, setCalls] = useState(MOCK_CALLS)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("http://localhost:8080/status");
        const data = await response.json();
        if (data.explaination !== "") {
            setCalls((prevCalls) => [data, ...prevCalls])
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
    const intervalId = setInterval(fetchStatus, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <ul className="space-y-2">
        {calls.map((call) => (
          <li key={call.date}>
            <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedCall(call)}>
              {call.number} - {call.date}
            </Button>
          </li>
        ))}
      </ul>
      <CallDialog call={selectedCall} onClose={() => setSelectedCall(null)} />
    </div>
  )
}

