"use client"

import { Button } from "@/components/ui/button"

export function CallList({ calls, onCallClick }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Recent Calls</h2>
      <ul className="space-y-2">
        {calls.map((call) => (
          <li key={call.id}>
            <Button variant="outline" className="w-full justify-start" onClick={() => onCallClick(call)}>
              {call.name} - {call.date}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

