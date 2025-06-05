import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loadnimation from "../../assets/loadAnim.lottie"
export default function LoadAnimationComponent(){
    return(
        <div className="load-animation-div">
            <DotLottieReact
            className="animation-lotties"
            loop
            autoplay
            src={loadnimation} />
        </div>
    )
}