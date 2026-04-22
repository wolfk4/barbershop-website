import React from "react";

const hours = 
[
  { day: "Sunday", open: "10:00 AM", closed: "5:00 PM" },
  { day: "Monday", open: "10:00 AM", closed: "6:00 PM" },
  { day: "Tuesday", open: "10:00 AM", closed: "6:00 PM" },
  { day: "Wednesday", open: "10:00 AM", closed: "6:00 PM" },
  { day: "Thursday", open: "10:00 AM", closed: "6:00 PM" },
  { day: "Friday", open: "10:00 AM", closed: "6:00 PM" },
  { day: "Saturday", open: "9:00 AM", closed: "5:00 PM" },
];

type HoursRowProps = {
  day: string;
  open: string;
  closed: string;
};



function HoursRow({ day, open, closed }: HoursRowProps): React.JSX.Element {
  return (
    <div className="flex justify-between items-center border-t border-gray-300 py-4 gap-4">
      <span className="text-black font-black uppercase tracking-widest text-lg">{day}</span>
      <span className="text-black font-black text-lg whitespace-nowrap shrink-0">{open} - {closed}</span>
    </div>
  );
}

function ShopHours() {
  return (
    <div className="w-full bg-gray-100 flex flex-col items-center py-10 px-6 sm:px-16 md:px-24">
      <h1 className="font-black uppercase text-4xl tracking-widest text-center mt-1">
        Shop Hours
      </h1>
      <div className="w-full max-w-2xl mt-4">
        {hours.map((entry) => (
          <HoursRow 
            key={entry.day} 
            day={entry.day}
            open={entry.open}    
            closed={entry.closed}
          />
        ))}
        <div className="border-t border-gray-300" />
      </div> 
      <p className="text-gray-800 italic text-sm mt-3">    
        Walk-ins welcome. Appointments recommended.
      </p>
    </div>
  ); 
}




export default ShopHours; 