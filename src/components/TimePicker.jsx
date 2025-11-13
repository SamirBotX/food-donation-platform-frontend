import { useState, useEffect, useRef } from "react";

export default function TimePicker({ value, onChange }) {
  const [hour, setHour] = useState(value.hour || "12");
  const [minute, setMinute] = useState(value.minute || "00");
  const [ampm, setAmpm] = useState(value.ampm || "AM");

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const ampmOptions = ["AM", "PM"];

  useEffect(() => {
    onChange({ hour, minute, ampm });
  }, [hour, minute, ampm]);

  const ScrollList = ({ list, selected, setSelected }) => (
    <div className="w-16 h-32 overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-white rounded-xl border border-green-200 shadow-inner">
      {list.map((item) => (
        <div
          key={item}
          onClick={() => setSelected(item)}
          className={`snap-center py-3 cursor-pointer text-center text-lg font-semibold ${
            selected === item
              ? "text-green-600 bg-green-100 rounded-lg"
              : "text-gray-600"
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-3">
      <ScrollList list={hours} selected={hour} setSelected={setHour} />
      <span className="text-lg font-bold text-gray-700">:</span>
      <ScrollList list={minutes} selected={minute} setSelected={setMinute} />
      <ScrollList list={ampmOptions} selected={ampm} setSelected={setAmpm} />
    </div>
  );
}
