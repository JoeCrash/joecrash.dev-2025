import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ShowcaseSection = () => {
    const sectionRef = useRef(null);
    const project1Ref = useRef(null);
    const project2Ref = useRef(null);
    const project3Ref = useRef(null);

    useGSAP(() => {
        const projects = [project1Ref, project2Ref, project3Ref];
        projects.forEach((card, index) => {
            gsap.fromTo(
                card.current,
                {
                    opacity: 0,
                    y: 100
                },
                {
                    opacity: 1, y: 0,
                    duration: 1,
                    delay: (index + 1) * 0.2,
                    scrollTrigger: {
                        trigger: card.current,
                        start: "top bottom-=100",
                        markers: false,
                    }
                }
            )
        })
    }, []);
    return (
        <section id="work" ref={sectionRef} className="app-showcase">
            <div className="w-full">
                <div className="showcaselayout">
                    {/*left side*/}
                    <div  ref={project1Ref} className="first-project-wrapper">
                        <div className="image-wrapper">
                            <img src="/images/project1.png" alt="ryde"/>
                        </div>
                        <div className="text-content">
                            <h2> ProjectName </h2>
                            <p className="text-white-50 md:text-xl">
                                Blegh
                            </p>
                        </div>
                    </div>
                    {/*right side*/}
                    <div className="project-list-wrapper overflow-hidden">
                        <div  ref={project2Ref} className="project">
                            <div className="image-wrapper bg-[#ffefdb]">
                                <img src="/images/project2.png" alt="ryde"/>
                            </div>
                            <h2>Label for project</h2>
                        </div>
                        <div  ref={project3Ref} className="project">
                            <div className="image-wrapper bg-[#ffefdb]">
                                <img src="/images/project3.png" alt="ryde"/>
                            </div>
                            <h2>Label for project</h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default ShowcaseSection
