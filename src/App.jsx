import { useEffect, useState } from "react";
import Prayers from "./component/prayers";

function App() {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [dateTime, setDateTime] = useState("");
  const [city, setCity] = useState("Cairo");
  const [nextPrayer, setNextPrayer] = useState({ name: "", time: "" });
  const [countdown, setCountdown] = useState("00:00");

  const citises = [
    { name: "القاهره", value: "Cairo" },
    { name: "الاسكندريه", value: "Alexandria" },
    { name: "الجيزه", value: "Giza" },
    { name: "المنصوره", value: "Mansoura" },
    { name: "اسوان", value: "Aswan" },
    { name: "الاقصر", value: "Luxor" },
    { name: "المنوفيه", value: "Monufia" },
  ];

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=EG&method=5`
        );
        const data_Prayer = await response.json();
        setPrayerTimes(data_Prayer.data.timings);
        setDateTime(data_Prayer.data.date.readable);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPrayerTimes();
  }, [city]);

  // helper: يحوّل HH:MM → Date object لليوم الحالي
  const parseTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const prayerDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    return prayerDate;
  };

  // تحديد الصلاة القادمة
  useEffect(() => {
    if (!prayerTimes || !prayerTimes.Fajr) return;

    const now = new Date();
    const schedule = [
      { name: "الفجر", time: parseTime(prayerTimes.Fajr) },
      { name: "الظهر", time: parseTime(prayerTimes.Dhuhr) },
      { name: "العصر", time: parseTime(prayerTimes.Asr) },
      { name: "المغرب", time: parseTime(prayerTimes.Maghrib) },
      { name: "العشاء", time: parseTime(prayerTimes.Isha) },
    ];

    // الصلاة القادمة هي أول واحدة وقتها > دلوقتي
    let upcoming = schedule.find((p) => p.time > now);

    // لو اليوم خلص → اعتبر الفجر بتاع بكرة
    if (!upcoming) {
      upcoming = schedule[0];
      upcoming.time.setDate(upcoming.time.getDate() + 1);
    }

    setNextPrayer(upcoming);

    // تحديث العدّاد كل ثانية
    const interval = setInterval(() => {
      const diff = upcoming.time - new Date();
      if (diff > 0) {
        const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
        const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
        const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
        setCountdown(`${h}:${m}:${s}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const formatTimes = (time) => {
    if (!time) return "00:00";
    let [hours, minutes] = time.split(":").map(Number);
    const perd = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${perd}`;
  };

  return (
    <section>
      <div className="container">
        <div className="top">
          <div className="city">
            <h3>المدينه</h3>
            <select onChange={(e) => setCity(e.target.value)}>
              {citises.map((city_obj) => (
                <option key={city_obj.value} value={city_obj.value}>
                  {city_obj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="date">
            <h3>التاريخ</h3>
            <Prayers name="التاريخ" time={dateTime} />
          </div>
        </div>

        <Prayers name="الفجر" time={formatTimes(prayerTimes.Fajr)} />
        <Prayers name="الظهر" time={formatTimes(prayerTimes.Dhuhr)} />
        <Prayers name="العصر" time={formatTimes(prayerTimes.Asr)} />
        <Prayers name="المغرب" time={formatTimes(prayerTimes.Maghrib)} />
        <Prayers name="العشاء" time={formatTimes(prayerTimes.Isha)} />
      </div>

      {/* --------- العدّاد --------- */}
      <div className="countdown">
        <h3>الصلاة القادمة: {nextPrayer?.name}</h3>
        <h4>{countdown}</h4>
      </div>
    </section>
  );
}

export default App;
