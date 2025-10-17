import {Canvas} from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'
import {useMediaQuery} from "react-responsive";
import {Room} from "./Room.jsx";
import HeroLights from "./HeroLights.jsx";
import LEDStrip from "./LEDStrip.jsx";
import VideoPlane from "./VideoPlane.jsx";

const HeroExperience = () => {
    const isTablet = useMediaQuery({query:"(max-width: 1024px)"});
    const headCycle = ["red","blue","green","brown","pink"]; // cycles on every end reversal

    return (
        <Canvas camera={{ position: [9, 7, 8], fov: 40 }}>
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
                pattern={headCycle}
                length={3.97}
                leds={40}
                stripWidth={0.025}
                thickness={0.04}
                mode="scanner"
                scannerColor="#ff1a1a"
                scannerSpeed={25}
                scannerWidth={15}
                scannerDecay={3.2}
                headBoost={3.5}
                glow
            />
            {/* LED Strip Side */}
            <LEDStrip
                position={[1.75, 1.635, -2]}
                rotation={[9.43, 1.58, 0]} // adjust to match that edge
                pattern={headCycle}
                length={1.6}
                leds={40}
                stripWidth={0.025}
                thickness={0.04}
                mode="scanner"
                scannerColor="#ff1a1a"
                scannerSpeed={25}
                scannerWidth={7}
                scannerDecay={3.2}
                headBoost={3.5}
                glow
            />
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
