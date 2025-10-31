import {useRef} from "react";

const GlowCard = ({card, children, index}) => {
    const cardRefs = useRef([]);

    const handleMouseMove = (index) => (e) => {
        const card = cardRefs.current[index];
        if (!card) return;

        //get mouse position
        const {left, top, width, height} = card.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        //convert mouse pos to angle
        const angle = (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;

        // set the angle as a CSS variable
        card.style.setProperty("--start", angle + 60);
    }

    const selfRefer = (el, cardRefs)=>{
        cardRefs.current[index] = el;
    }

    return (
        <div
            ref={(el)=>( selfRefer(el, cardRefs) ) } /* self Ref */
            onMouseMove={handleMouseMove(index)}
            className="card card-border timeline-card rounded-xl p-10 my-5"
        >
            <div className="glow"/>
            <div className={"flex items-center gap-1 mb-5 break-inside-avoid-column"}>
                {Array.from({length: 5}).map((_, i) => (
                    <img key={i} src="/images/star.png" alt="star" className="size-5" />
                ))}
            </div>
            <div className="mb-5">
                <p className="text-white-50 text-lg">{card.review}</p>
            </div>
            {children}
        </div>
    )
}
export default GlowCard
