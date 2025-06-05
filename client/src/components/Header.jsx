import { useState,useEffect } from "react";
export default function Header(){
    const [currentDate,setCurrentDate]=useState(new Date())


    useEffect(()=>{
        const interval=setInterval(()=>{
            setCurrentDate(new Date())
        },1000)

        return ()=>clearInterval(interval);
    },[])
    const timeOptions={
        hour:"2-digit",
        minute:"2-digit",
    }
    const currentTime=currentDate.toLocaleTimeString([],timeOptions)

    const [time,meridiem]=currentTime.split(" ")
    const [hr,mm]=time.split(":");

    const dateOption={
        month:"long",
        year:"numeric",
        day:"numeric",
    }
    return(
        <header className="header-component">
            <h2>Mood<span>Mixer</span></h2>
            <div className="dateTime-container">
                <h2>{`${hr}:${mm} `}<span className="seconds-AM-component">{`${meridiem}`}</span></h2>
                <h3>{currentDate.toLocaleString([],dateOption)}</h3>
            </div>
        </header>
    )
}