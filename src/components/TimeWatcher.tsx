import { useEffect, useState } from "react";

const TimeWatcher = ({ expire_time }: { expire_time: Date }) => {
  const [time, setTime] = useState<string | undefined>(undefined);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const milliseconds = expire_time.getTime() - new Date().getTime();
      if (milliseconds <= 0) {
        setTime("Time Expired");
        return;
      }
      const minutes = Math.floor(milliseconds / (1000 * 60));
      const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

      const time = `${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
      setTime(time);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [expire_time]);

  if (time == null) {
    return <div>Please wait</div>;
  }

  return <div>{time}</div>;
};

export default TimeWatcher;
