import { useEffect, useState } from "react"
import Prayers from "./component/prayers"
function App() {
  const [prayerTimes , setPrayerTimes]= useState({})
  const [dateTime , setDateTime]= useState("")
  const [city , setCity]= useState("Cairo")
  const citises = [
    {name:"القاهره" , value:"Cairo"},
    {name:"الاسكندريه" , value:"Alexandria"},
    {name:"الجيزه" , value:"Giza"},
    {name:"المنصوره" , value:"Mansoura"},
    {name:"اسوان" , value:"Aswan"},
    {name:"الاقصر" , value:"Luxor"},
    {name:"المنوفيه" , value:"Monufia"}   

  ]
  console.log(city);
  
  useEffect(() => {
    const fetchPrayerTimes = async () =>{
      try{
          const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=EG&method=5`)
          const data_Prayer =await response.json()
          setPrayerTimes(data_Prayer.data.timings)
          setDateTime(data_Prayer.data.date.readable)
          console.log(data_Prayer.data.date.readable) 
      }catch(error){
        console.error(error)
      }
    }
    fetchPrayerTimes()
  },[city])
  const formatTimes =(time) => {
    if(!time){
      return "00.00";
    }
    let [hours , minutes] = time.split(":").map(Number)
    const perd = hours >= 12 ? "PM" : "AM";
    hours = hours %12 || 12;
    return `${hours}:${ minutes < 10 ?  "0" + minutes : minutes } ${perd}`
  }
  return (
    <section>
    <div className="container">
      <div className="top">
        <div className="city">
          <h3>المدينه</h3>
          <select name="" id="" onChange={(e) => setCity(e.target.value)}>
            {citises.map((city_obj)=>(
              <option key={city_obj.value} value={city_obj.value}>{city_obj.name}</option>
            ))}
          </select>
          </div>
          <div className="date">
            <h3>التاريخ</h3>
            <h4>2025-09-8</h4>
        </div>
      </div>
      <Prayers name="الفجر" time={formatTimes (prayerTimes.Fajr)}/>
      <Prayers name="الظهر" time={formatTimes(prayerTimes.Dhuhr)}/>
      <Prayers name="العصر" time={formatTimes(prayerTimes.Asr)}/>
      <Prayers name="المغرب" time={formatTimes(prayerTimes.Maghrib)}/>
      <Prayers name="العشاء" time={formatTimes(prayerTimes.Isha)}/>
      </div>
    
    
    </section>
  )
}

export default App
