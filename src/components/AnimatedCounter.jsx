import {counterItems} from "../constants/index.js";
import CountUp from "react-countup";

const AnimatedCounter = () => {
    return (
        <div id="counter" className="padding-x-lg xl:mt-0 mt-32">
            <h2 className="text-white-50 text-xl md:text-xl relative z-10 pointer-events-none">Useless Stats That Look Cool.</h2>
            <div className="mx-auto grid-4-cols">
                {counterItems.map((item, index) => (
                    <div key={index} className="bg-zinc-900 rounded-lg p-10 flex flex-col justify-center">
                        <div key={index} className="counter-number text-white text-5xl font-bold mb-2">
                            <CountUp prefix={item.prefix} suffix={item.suffix} end={item.value} />
                        </div>
                        <div className="text-white-50 text-xl">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default AnimatedCounter
