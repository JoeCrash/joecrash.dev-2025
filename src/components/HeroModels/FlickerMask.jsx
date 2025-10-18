// FlickerMask.jsx
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function FlickerMask({
                                        children,
                                        enabled = true,
                                        freq = 4,        // Hz
                                        jitter = 0.6,    // 0..1 speed variance across materials
                                        depth = 0.6,     // 0..1 how dark the dips go
                                        seed = 1,        // deterministic
                                    }) {
    const group = useRef();
    const mats = useRef([]);

    // deterministic RNG
    const rand = useMemo(() => {
        let x = Math.imul(seed ^ 0x9e3779b1, 2654435761) >>> 0;
        return () => ((x = (x + 0x6d2b79f5) >>> 0), ((x ^ (x >>> 15)) & 0xffffffff) / 0xffffffff);
    }, [seed]);

    useEffect(() => {
        mats.current = [];
        group.current?.traverse((obj) => {
            const m = obj.material;
            if (!m) return;
            // handle arrays and single materials
            const list = Array.isArray(m) ? m : [m];
            list.forEach((mm) => {
                if (!mm) return;
                mats.current.push({
                    mat: mm,
                    // cache base intensities
                    baseEmi: mm.emissiveIntensity ?? 1,
                    // per-material phase/speed
                    phase: rand() * Math.PI * 2,
                    speed: freq * (1 + jitter * (rand() * 2 - 1)),
                });
            });
        });
    }, [children, freq, jitter, rand]);

    useFrame(({ clock }) => {
        if (!enabled) return;
        const t = clock.getElapsedTime();
        for (const it of mats.current) {
            const s = Math.sin(t * it.speed + it.phase) * 0.5 + 0.5; // 0..1
            const k = (1 - depth) + depth * s;                      // floor..1
            if ("emissiveIntensity" in it.mat) it.mat.emissiveIntensity = it.baseEmi * k;
            // if you also want albedo to pulse, uncomment:
            // if (it.mat.color) it.mat.color.multiplyScalar(k).clampScalar(0, 1);
        }
    });

    return <group ref={group}>{children}</group>;
}
