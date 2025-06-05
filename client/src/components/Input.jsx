import { useEffect, useRef, useState } from "react"
import * as motion from "motion/react-client"
import Music from "./Music";
import axios from "axios";
import LoadAnimationComponent from "./extra/LoadAnimation";

export default function Input(){
    const formRef=useRef(null)
    const [isLoading,setIsLoading]=useState(false)
    const [response,setResponse]=useState(null)
    const [hasError,setHasError]=useState(null);
    const [inputError, setInputError] = useState(false);


    async function handleSubmit(data){
        setIsLoading(true);
        setHasError(null); 
        setResponse(null);
        const moodData=data.get("mood");

        if(!moodData || moodData.trim()===''){
            setIsLoading(false);
            setInputError(true);
            return
        }
        setInputError(false)
        try{
            const res=await axios.post("/api/submitData",{mood:moodData})
            
            if (!res.data.errorMsg){
                setResponse(res.data.recData);
                
            }else{
                setHasError(res.data.errorMsg)
            }
        }catch(e){
            setHasError(e.message)
            console.log(e.message)
        }
        setIsLoading(false);
    }

    return(
        <div className="form-container"
            style={{
                justifyContent:"space-evenly"
            }}>
                
           
                <motion.form className="input-form"
                ref={formRef}
                onSubmit={(e)=>{
                    e.preventDefault();
                    handleSubmit(new FormData(e.target))
                    
                }}
                layout
                transition={{duration:0.3,bounce:0.2,type:"spring",stiffness:100,damping:20}}>
                    <input autoComplete="off" className={inputError?'input-error':''}   disabled={isLoading} type="text" placeholder="How are you feeling today?" name="mood"/>
                    <button disabled={isLoading}>Go</button>
                </motion.form>
                {!isLoading && !hasError && response? <motion.div
                            className="music-section-wrapper" initial={{scale:0}} animate={{scale:1}}>
                                <Music 
                                musicData={response}
/>
                            </motion.div>:
                            (isLoading ? <LoadAnimationComponent/> :(hasError?<h3>System Error: {hasError}</h3>:null))}
        </div>
    )
}