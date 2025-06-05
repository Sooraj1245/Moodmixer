import {
    IconButton,
    Slider
} from "@mui/material";

import {
    PlayArrowRounded as PlayIcon,
    PauseRounded as PauseIcon,
    VolumeDownRounded,
    VolumeUpRounded,
    VolumeMuteRounded,
    SkipNext as SkipNextIcon,
    SkipPrevious as SkipPreviousIcon
} from "@mui/icons-material";

import { useState, useEffect, useRef } from "react";

// import sample audio files
import hhh from "../assets/hhh.mp3";
import jjk from "../assets/jjk.mp3";

export default function Music({ musicData }) {
    const audioRef = useRef();

    // Player states
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [oldVolume, setOldVolume] = useState(0);
    const [isMute, setIsMute] = useState(false);

    // Track states
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const [currentSongName, setCurrentSongName] = useState(null);
    const [currentSongArtist, setCurrentSongArtist] = useState(null);

    // Playback progress
    const [progress, setProgress] = useState(0);
    const [dragValue, setDragValue] = useState(null);
    const [currentDrag,setCurrentDrag]=useState(null);
    const [currentDuration, setCurrentDuration] = useState(null);
    const [currentPlayTime, setCurrentPlayTime] = useState(null);

    // ----------------- Core Handlers -----------------

    function handlePlayPause() {
        if (!audioRef.current) return;
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
        setIsPlaying(prev => !prev);
    }

    function handleChange(e, value) {
        setDragValue(value);
    }

    function handleVolume(e, value) {
        setVolume(parseFloat(value));
    }

    function handleSeek(e,value){
      if(!audioRef.current) return;
      const duration=audioRef.current.duration;
      setCurrentDrag(dragValue);
      console.log(currentDrag);
    }

    function muteVolume() {
        setIsMute(prev => {
            if (!prev) {
                setOldVolume(volume);
                setVolume(0);
            } else {
                setVolume(oldVolume || 0.5);
            }
            return !prev;
        });
    }

    function handleSkipMusic() {
        setCurrentIndex(prev => (prev + 1) % musicData.length);
        resetAll();
    }

    function handlePrevMusic() {
        setCurrentIndex(prev => (prev - 1 + musicData.length) % musicData.length);
        resetAll();
    }

    function resetAll() {
        setDragValue(null);
        setCurrentPlayTime(null);
        setProgress(0);
        setIsPlaying(false);
    }

    // ----------------- Effects -----------------

    useEffect(() => {
        if (musicData[currentIndex]) {
            const song = musicData[currentIndex];
            setCurrentlyPlaying(song.streamUrl);
            setCurrentSongName(song.title || song.album_name);
            setCurrentSongArtist(song.user || song.artist_name);
        }
    }, [currentIndex]);

    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.play();
        setIsPlaying(true);
    }, [currentlyPlaying]);

    useEffect(() => {
        if (!audioRef.current) return;
        const duration = audioRef.current.duration;
        if (currentDrag !== null) {
            audioRef.current.currentTime = (currentDrag / 100) * duration;
        }
    }, [currentDrag]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        setIsMute(volume === 0);
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        function updateProgress() {
            if (!audio.duration) return;
            setProgress((audio.currentTime / audio.duration) * 100);
            setCurrentPlayTime(formatDuration(audio.currentTime));
        }

        function handleMetadata() {
            setCurrentDuration(formatDuration(audio.duration));
            audio.addEventListener("timeupdate", updateProgress);
            setIsLoading(false);
        }

        const handleWait = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);

        if (audio.readyState >= 1) {
            handleMetadata();
        } else {
            setIsLoading(true);
            audio.addEventListener("loadedmetadata", handleMetadata);
        }

        audio.addEventListener("waiting", handleWait);
        audio.addEventListener("canplay", handleCanPlay);
        audio.addEventListener("ended", handleSkipMusic);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", handleMetadata);
            audio.removeEventListener("canplay", handleCanPlay);
            audio.removeEventListener("waiting", handleWait);
            audio.removeEventListener("ended", handleSkipMusic);
        };
    }, [currentlyPlaying]);

    // ----------------- Helpers -----------------

    function formatDuration(duration) {
        const min = Math.floor(duration / 60);
        const sec = Math.floor(duration % 60);
        return { min, sec: sec < 10 ? `0${sec}` : sec };
    }

    function SkeletonSlider() {
        return (
            <div style={{
                height: '6px',
                backgroundColor: '#e0e0e0',
                borderRadius: '3px',
                position: 'relative',
                overflow: 'hidden',
                margin: '12px 0'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '150%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), var(--accent), rgba(255,255,255,0.8), transparent)',
                    transform: 'translateX(-100%)',
                    animation: 'shimmer 1.2s infinite ease-in-out'
                }} />
                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>
        );
    }

    // ----------------- JSX -----------------

    return (
        <section className="music-box">
            <audio ref={audioRef} style={{ display: "none" }} src={currentlyPlaying} />

            <div className="songInfo-container">
                <h2>{currentSongName}</h2>
                <p>{currentSongArtist}</p>
            </div>

            <div>
                {!isLoading ? (
                    <Slider
                        aria-label="Progress Bar"
                        min={0}
                        max={100}
                        value={!dragValue?progress:dragValue}
                        onChange={handleChange}
                        onChangeCommitted={handleSeek}
                        sx={{
                                color: "var(--accent)",
                                height: 6, // track height
                                '& .MuiSlider-thumb': {
                                  width: 15,
                                  height: 15 ,
                                  backgroundColor: '#0088aa', // your custom color
                                  border: 'none',
                                  boxShadow: '0 0 0 2px rgba(0,0,0,0.2)',
                                  '&:hover, &.Mui-focusVisible': {
                                    boxShadow: '0 0 0 4px rgba(37, 191, 211, 0.3)',
                                  },
                                  '&.Mui-active': {
                                    boxShadow: '0 0 0 6px rgba(0,0,0,0.3)',
                                  },
                                },
                                '& .MuiSlider-rail': {
                                  opacity: 0.3,
                                  backgroundColor: 'var(--accent)',
                                },
                                '& .MuiSlider-track': {
                                  backgroundColor: 'var(--accent)',
                                }
                            }}
                        size="medium"
                        
                    />
                ) : (
                    <SkeletonSlider />
                )}
                <div className="music-duration-component">
                    <p>{currentPlayTime ? `${currentPlayTime.min}:${currentPlayTime.sec}` : "0:00"}</p>
                    <p>{currentDuration ? `${currentDuration.min}:${currentDuration.sec}` : "NaN"}</p>
                </div>
            </div>

            <div className="playback-control-component">
                <div>
                    <IconButton onClick={handlePrevMusic} sx={{ color: "var(--font-color)", p: 0 }}>
                        <SkipPreviousIcon sx={{ fontSize: "var(--skip-buttons)" }} />
                    </IconButton>
                    <IconButton onClick={handlePlayPause} sx={{ color: "var(--font-color)", p: 0 }}>
                        {isPlaying ? (
                            <PauseIcon sx={{ fontSize: "var(--playpause-button)" }} />
                        ) : (
                            <PlayIcon sx={{ fontSize: "var(--playpause-button)" }} />
                        )}
                    </IconButton>
                    <IconButton onClick={handleSkipMusic} sx={{ color: "var(--font-color)", p: 0 }}>
                        <SkipNextIcon sx={{ fontSize: "var(--skip-buttons)" }} />
                    </IconButton>
                </div>

                <div className="volume-control-component">
                    <IconButton onClick={muteVolume} sx={{ color: "var(--font-color)" }}>
                        {volume === 0 ? (
                            <VolumeMuteRounded sx={{ fontSize: 30 }} />
                        ) : volume > 0.5 ? (
                            <VolumeUpRounded sx={{ fontSize: 30 }} />
                        ) : (
                            <VolumeDownRounded sx={{ fontSize: 30 }} />
                        )}
                    </IconButton>
                    <Slider
                        min={0}
                        max={1}
                        step={0.001}
                        value={volume}
                        onChange={handleVolume}
                        size="small"
                        sx={{ width: "100px", color: "var(--accent)" }}
                    />
                </div>
            </div>
        </section>
    );
}
