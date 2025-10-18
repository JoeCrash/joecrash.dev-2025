// LEDText.jsx
import {useMemo, useRef, useEffect} from "react";
import * as THREE from "three";
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import fontJSON from './joecrash_adelia.json'; // Import your JSON font file

/**
 * Render text as a stroked LED path using instanced spheres.
 *
 * Props:
 * - text: string
 * - fontUrl: path to THREE JSON font (e.g. helvetiker_regular.typeface.json or a cursive font you export)
 * - size: text height in scene units
 * - letterSpacing: additional spacing between glyphs (units)
 * - spacing: distance between LEDs along the path (units)
 * - color: LED color
 * - intensity: emissive intensity
 * - thickness: LED sphere radius
 * - position, rotation: transform the whole text
 * - align: "left" | "center" | "right"
 *
 */

const LEDText = ({
                     text = "JoeCrash.dev",
                     fontUrl = fontJSON,
                     size = 0.5,
                     letterSpacing = 0.1,
                     spacing = 0.05,
                     color = "#2dffa7",
                     intensity = 2,
                     thickness = 0.03,
                     position = [0, 0, 0],
                     rotation = [0, 0, 0],
                     align = "center",
                 }) => {
    const font = useMemo(() => new FontLoader().parse(fontUrl), [fontUrl]);
    const instRef = useRef();
    const mat = useMemo(() => new THREE.Matrix4(), []);

    const points = useMemo(() => {
        if (!font || !text) return [];
        const perChar = [];
        let cursorX = 0;

        for (const ch of text) {
            const shapes = font.generateShapes(ch, size);
            const advance =
                (font.data.glyphs?.[ch]?.ha ?? font.data.resolution * 0.5) *
                (size / font.data.resolution) +
                letterSpacing;

            const pts = [];
            shapes.forEach((shape) => {
                const outline = shape.getPoints(64);
                if (outline.length > 1) {
                    let acc = 0;
                    let last = outline[0];
                    pts.push(new THREE.Vector3(cursorX + last.x, last.y, 0));
                    for (let i = 1; i < outline.length; i++) {
                        const p = outline[i];
                        const seg = last.distanceTo(p);
                        acc += seg;
                        while (acc >= spacing) {
                            const t = 1 - (acc - spacing) / seg;
                            const ix = THREE.MathUtils.lerp(last.x, p.x, t);
                            const iy = THREE.MathUtils.lerp(last.y, p.y, t);
                            pts.push(new THREE.Vector3(cursorX + ix, iy, 0));
                            acc -= spacing;
                        }
                        last = p.clone();
                    }
                }
                shape.holes?.forEach((hole) => {
                    const hs = hole.getPoints(64);
                    if (hs.length > 1) {
                        let acc = 0;
                        let last = hs[0];
                        pts.push(new THREE.Vector3(cursorX + last.x, last.y, 0));
                        for (let i = 1; i < hs.length; i++) {
                            const p = hs[i];
                            const seg = last.distanceTo(p);
                            acc += seg;
                            while (acc >= spacing) {
                                const t = 1 - (acc - spacing) / seg;
                                const ix = THREE.MathUtils.lerp(last.x, p.x, t);
                                const iy = THREE.MathUtils.lerp(last.y, p.y, t);
                                pts.push(new THREE.Vector3(cursorX + ix, iy, 0));
                                acc -= spacing;
                            }
                            last = p.clone();
                        }
                    }
                });
            });

            perChar.push(pts);
            cursorX += advance;
        }

        const all = perChar.flat();
        if (!all.length) return all;

        const box3 = new THREE.Box3().setFromPoints(all);
        const width = box3.max.x - box3.min.x;
        const xOffset =
            align === "center"
                ? -box3.min.x - width / 2
                : align === "right"
                    ? -box3.max.x
                    : -box3.min.x;
        const yOffset = -box3.min.y;

        return all.map((v) => new THREE.Vector3(v.x + xOffset, v.y + yOffset, v.z));
    }, [font, text, size, letterSpacing, spacing, align]);

    useEffect(() => {
        const im = instRef.current;
        if (!im) return;
        for (let i = 0; i < points.length; i++) {
            mat.identity().setPosition(points[i]);
            im.setMatrixAt(i, mat);
        }
        im.instanceMatrix.needsUpdate = true;
    }, [points, mat]);

    if (points.length === 0) return null;

    return (
        <group position={position} rotation={rotation}>
            <instancedMesh
                ref={instRef}
                args={[undefined, undefined, points.length]}
                frustumCulled={false}
            >
                <sphereGeometry args={[thickness, 12, 12]}/>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={intensity}
                    roughness={0.3}
                    metalness={0.05}
                    toneMapped={false}
                />
            </instancedMesh>
        </group>
    );
};

export default LEDText;