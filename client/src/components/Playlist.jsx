import hhh from "../assets/hhh.mp3"
import playIcon from "../assets/play.png"
import pauseIcon from "../assets/pause.png"
import { useState,useRef, useEffect } from "react"
import volumeIcon from "../assets/volume.png"
export default function Playlist(){

    const [progress,setProgress]=useState(0);
    const [isPlaying,setIsPlaying]=useState(false);
    const [volume,setVolume]=useState(0.5);
    const audioRef=useRef();

    function handleClick(){
        if(!audioRef.current) return;
        if(isPlaying){
            audioRef.current.pause();
        }else{
            audioRef.current.play();
        }
        setIsPlaying(prevValue=>!prevValue);
    }

    function handleVolumeChange(e){
        if(!audioRef.current) return
        const newVol=parseFloat(e.target.value);
        setVolume(newVol);
        audioRef.current.volume=volume;
    }
    useEffect(()=>{
        const audio=audioRef.current;

        function updateProgress(){
            setProgress((audio.currentTime/audio.duration)*100)
        }

        audio.addEventListener("timeupdate",updateProgress);
        return ()=>audio.removeEventListener("timeupdate",updateProgress)
    },[])


    return (
        <section className="music-section">
            <audio ref={audioRef} src={hhh} />
            <div className="progress-bar">
                <div className="progress-bar-fill" style={{width:`${progress}%`,backgroundColor:"var(--accent)"}}></div>
            </div>
            <div className="music-controls">
                <div className="pause-play" >
                    <img src={isPlaying?pauseIcon:playIcon} onClick={handleClick} />
                </div>
                    <div className="volume">
                    <div><img src={volumeIcon} alt="Volume" /></div>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                </div>
            </div>
            </section>

    )
}