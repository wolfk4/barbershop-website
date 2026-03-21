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

type HoursRowProps = 
{
    day: string;
    open: string;
    closed: string;

}

function HoursRow({ day, open, closed }: HoursRowProps): React.JSX.Element
{
  return (
    <div className="hours-row">
      <span className="day">{day}</span>
      <span className="time">{open} - {closed}</span>
    </div>
  );
}

function ShopHours() 
{
  return (
    <div className="shop-hours">
      <h1>Shop Hours</h1>
      <div className="hours-list">
        {hours.map((entry) => 
        (
          <HoursRow key={entry.day} day={entry.day} open={entry.open} closed={entry.closed}/>
        ))}
      </div>
      <p className="walk-in-message">Walk-ins welcome. Appointments recommended.</p>
    </div>
  );
}

export default ShopHours;