import * as THREE from "three";

const HeroLights = () => (
    <>
        {/* lamp's light */}
        <spotLight
            position={[2, 5, 6]}
            angle={0.55}
            penumbra={0.2}
            intensity={25}
            color="yellow"
        />
        {/* bluish overhead lamp */}
        <spotLight
            position={[4, 5, 4]}
            angle={0.3}
            penumbra={0.5}
            intensity={40}
            color="#4cc9f0"
        />
        {/* purplish side fill */}
        <spotLight
            position={[-3, 5, 5]}
            angle={0.4}
            penumbra={1}
            intensity={60}
            color="green"
        />

        {/* subtle point light for atmospheric tone */}
        <pointLight position={[0, 3, 0]} intensity={10} color="orange" />
        <pointLight position={[1, 2, -2]} intensity={10} color="#0d00a4" />
    </>
);

export default HeroLights;