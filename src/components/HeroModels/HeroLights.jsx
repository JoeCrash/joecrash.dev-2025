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
            position={[4, 6, 4]}
            angle={0.5}
            penumbra={0.99}
            intensity={90}
            color="#4cc9f0"
        />

        {/* subtle point light for atmospheric tone */}
        <pointLight position={[0, 3, 0]} intensity={10} color="orange" />
        <pointLight position={[-1.5, 2.5, -1]} intensity={3} color="gray" />

    </>
);

export default HeroLights;