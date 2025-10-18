import {Canvas} from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'
import {useMediaQuery} from "react-responsive";
import {Room} from "./Room.jsx";
import HeroLights from "./HeroLights.jsx";
import LEDStrip from "./LEDStrip.jsx";
import LEDText from "./LEDText.jsx";
import VideoPlane from "./VideoPlane.jsx";
import FlickerMask from "./FlickerMask.jsx";

const HeroExperience = () => {
    const isTablet = useMediaQuery({query:"(max-width: 1024px)"});
    const scannerPattern = ["red","blue","red","green","red","yellow","red","pink"]; // cycles on every end reversal
    {/*const wallPosition = [[0.4, 3.4, -2.8],[0, 0.04, 0]];*/}
    const floatPosition = [[0.6, 0.5, 0.8],[0, 0.6, 0]];
    return (
        <Canvas camera={{ position: [9, 5, 8], fov: 40 }}>
            <HeroLights />
            {/* Video Plane Screen 1*/}
            <VideoPlane
                src="/videos/cj-intro.mp4"
                position={[-0.85, 2.395, -2.35]}
                rotation={[0, Math.PI * 0.125, 0]} // match the screen tilt
                width={0.88}                       // adjust to bezel
                scaleX={1.7}   // widen
                scaleY={0.75}
                muted
                loop
            />
            {/* Video Plane Screen 2*/}
            <VideoPlane
                src="/videos/video2.mp4"
                position={[0.55, 2.395, -2.63]}
                rotation={[0, -Math.PI * 0.001, 0]} // match the screen tilt
                width={0.88}                       // adjust to bezel
                scaleX={1.7}   // widen
                scaleY={0.75}
                muted
                loop
            />
            {/* LED Strip Front */}
            <LEDStrip
                position={[-0.239 ,1.635,-1.152]}
                pattern={scannerPattern}
                length={3.97}
                leds={40}
                stripWidth={0.025}
                thickness={0.04}
                mode="scanner"
                scannerColor="#ff1a1a"
                scannerSpeed={25}
                scannerWidth={15}
                scannerDecay={6}
                headBoost={5}
                glow
            />
            {/* LED Strip Side */}
            <LEDStrip
                position={[1.75, 1.635, -2]}
                rotation={[9.43, 1.58, 0]} // adjust to match that edge
                pattern={scannerPattern}
                length={1.6}
                leds={40}
                stripWidth={0.025}
                thickness={0.04}
                mode="scanner"
                scannerColor="#ff1a1a"
                scannerSpeed={25}
                scannerWidth={7}
                scannerDecay={3.2}
                headBoost={5}
                glow
            />

            <FlickerMask enabled freq={3} jitter={1.8} depth={0.9}>
                {/* LED Text logo main */}
                <LEDText
                    text="JoeCrash.dev"
                    size={0.6}
                    spacing={.006}
                    thickness={0.007}
                    color = "#14d7c8"
                    intensity={2}
                    align="center"
                    position={floatPosition[0]}
                    rotation={floatPosition[1]}
                />
            </FlickerMask>

            {/* LED Text on Wall
            <LEDText
                text="JoeCrash.dev"
                size={0.3}
                spacing={.0001}
                thickness={0.0015}
                color = "#14d7c8"
                intensity={70}
                align="center"
                position={wallPosition[0]}
                rotation={wallPosition[1]}
            />
            */}

            <OrbitControls
                enablePan={false}
                enableZoom={!isTablet}
                maxDistance={18}
                minDistance={3}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI / 2}
            />
            <Room/>
        </Canvas>
    )
}
export default HeroExperience
