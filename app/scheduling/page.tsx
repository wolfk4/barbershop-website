"use client";

// app/scheduling/page.tsx
import { Button } from "@/components/ui/button";

export default function SchedulingPage() {
  const handleScheduleClick = () => {
    // We will add the Booksy API logic here later
    alert("Schedule button clicked!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <h1 className="text-4xl font-bold mb-8">Schedule Your Appointment</h1>
      <p className="text-lg mb-8">Click the button below to book your appointment through Booksy.</p>
      <Button onClick={handleScheduleClick} size="lg">
        Schedule
      </Button>
    </div>
  );
}
