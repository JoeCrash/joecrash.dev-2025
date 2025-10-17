import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Modes:
// 1) wrap: rotating pattern along the strip
// 2) scanner: ping–pong head with falloff. If `pattern` is an array, the head
//    color advances to the next entry on each end reversal.
const LEDStrip = ({
                      position = [0, 0, 0],
                      rotation = [0, 0, 0],          // rotate whole strip
                      length = 1,
                      leds = 20,
                      color = "#00e5ff",
                      thickness = 0.02,
                      intensity = 4,

                      // motion mode
                      mode = "wrap", // "wrap" | "scanner"

                      // wrap mode
                      pattern = null,
                      patternOffset = 0,
                      scrollSpeed = 0,

                      // scanner mode
                      scannerColor = "#ff0000",
                      scannerSpeed = 8,         // LEDs per second
                      scannerWidth = 2,         // trail half-width in LEDs
                      scannerDecay = 2.0,       // falloff exponent
                      headBoost = 2.0,          // extra intensity at the head

                      // trail shaping (hue-locked)
                      trailSaturationMin = 0.15,
                      trailOpacityMin = 0.12,   // requires per-bulb material.opacity
                      trailLightnessMin = 0.18, // slight darkening toward tail
                      trailLightnessPow = 0.6,  // 0..1 curve for lightness interpolation

                      // geometry/style
                      stripWidth = thickness * 0.35,

                      // bloom/glow
                      glow = false,
                      bloomIntensity = 1.1,
                      bloomThreshold = 0.1,
                      bloomSmoothing = 0.2,
                      bloomRadius = 0.85
                  }) => {
    // Positions along +X
    const step = leds > 1 ? length / (leds - 1) : 0;
    const start = -length / 2;
    const bulbs = useMemo(
        () => Array.from({ length: Math.max(1, leds) }, (_, i) => ({ key: i, x: start + i * step })),
        [leds, start, step]
    );

    // Per-bulb materials
    const matRefs = useRef([]);
    const lastShift = useRef(-1);

    // Scanner state: pattern head color and direction
    const headColorIndex = useRef(0);
    const lastDirection = useRef(1); // +1 forward, -1 backward

    // ---------- helpers ----------
    const setBulb = (i, col, emi, opa) => {
        const m = matRefs.current[i];
        if (!m) return;
        m.color.set(col);
        m.emissive.set(col);
        m.emissiveIntensity = emi;
        m.transparent = true;
        m.opacity = opa;
        // keep depthWrite on to reduce sorting artifacts for thin spheres
        m.depthWrite = true;
    };

    const applyWrap = (shiftVal) => {
        const usePat = Array.isArray(pattern) && pattern.length > 0;
        for (let i = 0; i < bulbs.length; i++) {
            const base = usePat ? pattern[(i + shiftVal) % pattern.length] : color;
            const col = new THREE.Color(base);
            setBulb(i, col, intensity, 1.0);
        }
    };

    // Hue-locked trail color from a head color and fall factor [0..1]
    const colorFromHeadFall = (headHex, fall) => {
        const c = new THREE.Color(headHex);
        const hsl = { h: 0, s: 0, l: 0 };
        c.getHSL(hsl);
        const s = THREE.MathUtils.lerp(trailSaturationMin, hsl.s, fall);
        const l = THREE.MathUtils.lerp(trailLightnessMin, hsl.l, Math.pow(fall, trailLightnessPow));
        const out = new THREE.Color().setHSL(hsl.h, s, l);
        return out;
    };

    const applyScanner = (pos, headHex) => {
        for (let i = 0; i < bulbs.length; i++) {
            const d = Math.abs(i - pos);
            const norm = Math.max(0, 1 - d / Math.max(0.0001, scannerWidth));
            const fall = Math.pow(norm, scannerDecay);            // 0..1 along trail
            const col = colorFromHeadFall(headHex, fall);         // hue preserved
            const emi = intensity * (1 + (headBoost - 1) * Math.max(0, 1 - Math.abs(i - pos)));
            const opa = THREE.MathUtils.lerp(trailOpacityMin, 1.0, fall);
            setBulb(i, col, Math.max(0.0001, emi * fall), opa);
        }
    };

    // ---------- init ----------
    useEffect(() => {
        headColorIndex.current = 0;
        lastDirection.current = 1;

        if (mode === "scanner") {
            const headHex = (Array.isArray(pattern) && pattern.length)
                ? pattern[headColorIndex.current]
                : scannerColor;
            applyScanner(0, headHex);
            lastShift.current = -1;
            return;
        }

        const plen = pattern?.length || 1;
        const base = ((patternOffset % plen) + plen) % plen;
        applyWrap(base);
        lastShift.current = base;
    }, [
        mode, pattern, patternOffset, color, intensity, bulbs.length,
        scannerColor, trailSaturationMin, trailOpacityMin, trailLightnessMin, trailLightnessPow
    ]);

    // ---------- animate ----------
    useFrame(({ clock }) => {
        if (mode === "scanner") {
            const range = Math.max(0, bulbs.length - 1);
            if (range === 0) return;

            const cycle = 2 * range;
            const t = clock.getElapsedTime();
            const u = (t * scannerSpeed) % cycle;
            const goingForward = u <= range;
            const dir = goingForward ? 1 : -1;

            // On direction flip, advance head color if pattern exists
            if ((Array.isArray(pattern) && pattern.length) && dir !== lastDirection.current) {
                headColorIndex.current = (headColorIndex.current + 1) % pattern.length;
                lastDirection.current = dir;
            }

            const pos = goingForward ? u : 2 * range - u;
            const headHex = (Array.isArray(pattern) && pattern.length)
                ? pattern[headColorIndex.current]
                : scannerColor;

            applyScanner(pos, headHex);
            return;
        }

        // wrap mode scroll
        if (!(Array.isArray(pattern) && pattern.length) || !scrollSpeed) return;
        const t = clock.getElapsedTime();
        const plen = pattern.length;
        const rawShift = patternOffset + Math.floor(t * scrollSpeed);
        const shift = ((rawShift % plen) + plen) % plen;
        if (shift !== lastShift.current) {
            applyWrap(shift);
            lastShift.current = shift;
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* backing strip */}
            <mesh position={[0, 0, -thickness * 0.4]}>
                <boxGeometry args={[length, stripWidth, thickness * 0.2]} />
                <meshStandardMaterial color="#161616" roughness={0.85} metalness={0.15} />
            </mesh>

            {/* bulbs */}
            {bulbs.map(({ key, x }, i) => (
                <mesh key={key} position={[x, 0, 0]}>
                    <sphereGeometry args={[thickness * 0.35, 16, 16]} />
                    <meshStandardMaterial
                        ref={(el) => (matRefs.current[i] = el)}
                        color={color}
                        emissive={color}
                        emissiveIntensity={intensity}
                        roughness={0.3}
                        metalness={0.05}
                        transparent
                        opacity={1}
                    />
                </mesh>
            ))}

            {/* thin guide under bulbs */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -stripWidth * 0.5, 0]}>
                <cylinderGeometry args={[thickness * 0.05, thickness * 0.05, length, 16]} />
                <meshStandardMaterial color="#2a2a2a" roughness={1} />
            </mesh>

            {glow && (
                <EffectComposer>
                    <Bloom
                        mipmapBlur
                        intensity={bloomIntensity}
                        luminanceThreshold={bloomThreshold}
                        luminanceSmoothing={bloomSmoothing}
                        radius={bloomRadius}
                    />
                </EffectComposer>
            )}
        </group>
    );
};

export default LEDStrip;
