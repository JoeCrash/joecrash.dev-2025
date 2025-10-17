// VideoPlane.jsx
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useVideoTexture } from "@react-three/drei";

export default function VideoPlane({
                                       src,
                                       position = [0, 0, 0],
                                       rotation = [0, 0, 0],
                                       width = 1,            // base width in scene units
                                       height = null,        // if null, auto from video aspect
                                       scaleX = 1,           // stretch horizontally
                                       scaleY = 1,           // stretch vertically
                                       loop = true,
                                       muted = true,
                                       paused = false,
                                       playbackRate = 1,
                                       doubleSided = false,
                                       toneMapped = false,   // keep video UI-bright
                                   }) {
    const texture = useVideoTexture(src, {
        crossOrigin: "anonymous",
        muted,
        loop,
        autoplay: !paused,
        playsInline: true,
    });

    // ensure correct color space for three r180+
    if (texture) texture.colorSpace = THREE.SRGBColorSpace;

    const video = texture?.image;

    useEffect(() => {
        if (!video) return;
        video.muted = muted;
        video.loop = loop;
        video.playbackRate = playbackRate;
        if (paused) video.pause();
        else video.play().catch(() => {});
    }, [video, muted, loop, paused, playbackRate]);

    const [w, h] = useMemo(() => {
        const vw = video?.videoWidth || 1;
        const vh = video?.videoHeight || 1;
        const aspect = vw / vh;
        return height != null ? [width, height] : [width, width / aspect];
    }, [video?.videoWidth, video?.videoHeight, width, height]);

    return (
        <mesh position={position} rotation={rotation} scale={[scaleX, scaleY, 1]}>
            <planeGeometry args={[w, h]} />
            <meshBasicMaterial
                map={texture}
                toneMapped={toneMapped}
                side={doubleSided ? THREE.DoubleSide : THREE.FrontSide}
            />
        </mesh>
    );
}
