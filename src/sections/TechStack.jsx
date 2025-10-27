import {useGSAP} from "@gsap/react";
import { gsap } from "gsap";
import {techStackIcons, techStackImgs} from "../constants/index.js";
import TitleHeader from "../components/TitleHeader.jsx";
import TechIcon from "../components/models/tech_logos/TechIcon.jsx";

const TechStack = () => {
    useGSAP(()=>{
        gsap.fromTo('.tech-card',
            {y:50, opacity: 0},
            {
                y: 0,
                opacity: 1,
                duration: 2,
                ease:'power2.easeInOut',
                stagger:0.25,
                scrollTrigger: {
                    trigger:"#skills",
                    start:"top center"
                }
            }
        )
    },[])

    return (
        <div id="skills" className="flex-center section-padding">
            <div className="w-full h-full md:px-10 px-5">
                <TitleHeader title="Tech Stack" sub="Technologies I use"/>
                <div className="tech-grid">
                    {techStackIcons.map((icon, index) => (
                        <div key={index} className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg">
                            <div className="tech-card-content">
                                <div className="tech-card-animated-bg" />
                                <div className="tech-icon-wrapper">
                                    <TechIcon model={icon} />
                                </div>
                                <div className="padding-x h-1/2 w-full">
                                    <p>
                                        {icon.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/*{techStackImgs.map((icon, index) => (
                        <div key={index} className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg">
                            <div className="tech-card-content">
                                <div className="tech-card-animated-bg" />
                                <div className="tech-icon-wrapper">
                                    <img src={icon.imgPath} />
                                </div>
                                <div className="padding-x w-full">
                                    <p>
                                        {icon.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}*/}
                </div>
            </div>
        </div>
    )
}
export default TechStack
