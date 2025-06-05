import e from "express";
import bodyParser from "body-parser";
import {getMoodList} from "./aiHandler.js"
import axios from "axios";
import cors from "cors"

const app= e();
app.use(bodyParser.json())

const port="5000"

app.use(cors({
    origin: [
        'https://moodmixer-d67xlv04v-soorajs-projects-1d569588.vercel.app',
        'http://localhost:5173',
    ],
    credentials: true
}));
app.post("/api/submitData",async (req,res)=>{
    const data=req.body;
    const sysReply={
            recData:null,
            errorMsg:null
        };
    try{
        
        const mood=data.mood;
        // const tempMood=["Serious","Sentimental","Romantic"];
        const moodList=await getMoodList(mood);
        const moodArr=moodList.slice(1,-1).split(",");
        const {musicData,musicError}=await sendAPICall(moodArr);
        res.send(musicError?{...sysReply,errorMsg:musicError}:{...sysReply,recData:musicData})
    }catch(e){
        console.log(e)
        res.send({...sysReply,errorMsg:e.message})
    }
})


app.listen(port,()=>{
    console.log(`Listening on port: ${port}`)
})



//trackList


async function sendAPICall(m){
    const sysReply={
            musicData:null,
            musicError:null
        }
    try{
        
        const totalAPICalls=m.map((moodElement)=>
            apiCalls.get('/search',{
                params:{
                    sort_method:"relevant",
                    mood:moodElement
                }
            })
        );

        const returnedAPIResult=await Promise.all(totalAPICalls);
        
        const combinedResultArray=returnedAPIResult.reduce((acc,res)=>{
            if(res.data&&res.data.data){
                return acc.concat(res.data.data);
            }
            return acc;
        },[]);

        const cleanedArray=combinedResultArray.map((trackDetails)=>({
            id:trackDetails.id,
            title:trackDetails.title,
            user:trackDetails.user.name,
            streamUrl:`https://discoveryprovider.audius.co/v1/tracks/${trackDetails.id}/stream`
        }));
        return {...sysReply,musicData:cleanedArray};
    }catch(e){
        console.log(e)
        return {...sysReply,musicError:e.message};
    }
};


const apiCalls=axios.create({

    baseURL:'https://discoveryprovider.audius.co/v1/tracks/'
});



