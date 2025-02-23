"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function CallDialog({ call, onClose }) {
  if (!call) return null

  return (
    <Dialog open={!!call} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{call.name}</DialogTitle>
          <DialogDescription>Call Details</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p>
            <strong>Phone Number:</strong> {call.number}
          </p>
          <p>
            <strong>Date:</strong> {call.date}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

