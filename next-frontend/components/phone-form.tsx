"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label";

export function PhoneForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setIsLoading(true);
    event.preventDefault();
    console.log("name", name);
    console.log("phone", phone);
    console.log("guardianPhone", guardianPhone);
    const body = {
      name: name,
      phone: phone,
      guardian: guardianPhone,
    };

    fetch("http://localhost:8080/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

      router.push("/calls")
  }

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="guardian-phone">Guardian&apos;s Phone Number</Label>
        <Input
          id="guardian-phone"
          onChange={(e) => setGuardianPhone(e.target.value)}
          placeholder="Enter guardian's phone number"
        />
      </div>
      <Button onClick={handleClick} className="w-full">
        {isLoading ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
}
