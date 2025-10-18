import { words, words2 } from '../constants/index.js'
import Button from "../components/Button.jsx";
import HeroExperience from "../components/HeroModels/HeroExperience.jsx";

const Hero = () => {
    return (
        <section id="hero" className="relative overflow-hidden">
            <div className="absolute top-0 left-0 z-10">
                <img src="/images/bg.png" alt="Background" />
            </div>
            <div className="hero-layout">
                {/* LEFT HERO CONTENT */}
                <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5">
                    <div className="flex flex-col gap-7">
                        <div className="hero-text">
                            <h1>I transform
                                <span className="slide">
                                    <span className="wrapper">
                                        {words.map((word, index) => (
                                            <span key={index} className="flex items-center md:gap-3 gap-1 pb-2">
                                                <img src={word.imgPath} alt={word.text} className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50" />
                                                <span>{word.text}</span>
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            </h1>
                            <h1>into Complete</h1>
                            <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">
                                I am a full stack developer who enjoys figuring out the hard stuff.
                            </p>
                            <Button className="md:w-80 md:h-16 w-60 h-12" id="button" text="See my work" />
                        </div>
                    </div>
                </header>
                {/* RIGHT 3D MODEL */}
                <figure>
                    <div className="hero-3d-layout">
                        <HeroExperience />
                    </div>
                </figure>

            </div>
        </section>
    )
}
export default Hero
