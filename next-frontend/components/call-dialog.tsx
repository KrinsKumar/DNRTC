"use client"

import { Phone, Calendar, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CallDialog({ call, onClose }) {
  if (!call) return null

  return (
    <Dialog open={!!call} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{call.number}</DialogTitle>
          <DialogDescription>Call details and information</DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{call.date}</span>
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Explanation
            </h4>
            <ScrollArea className="h-[100px] rounded-md border p-4">
              <p className="text-sm text-muted-foreground">{call.explaination}</p>
            </ScrollArea>
            {call.remediation && (
              <div>
                <h4 className="mb-2 text-sm font-medium flex items-center  mt-4">
                  <Info className="h-4 w-4 mr-2" />
                  Remediation
                </h4>
                    <div className="text-sm text-muted-foreground mx-4" dangerouslySetInnerHTML={{ __html: call.remediation }} />
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

