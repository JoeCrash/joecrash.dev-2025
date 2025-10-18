import {useGLTF, useTexture} from '@react-three/drei';
import * as THREE from "three";
import {useMemo} from "react";

export function Room(props) {
  const { nodes, materials } = useGLTF('/models/optimized-room.glb');

    const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#000000",
        transmission: 0.9,  // real transparency
        thickness: 0.02,
        roughness: 0.1,
        metalness: -0.042,
        transparent: true,  // still needed for renderer sorting
        opacity: 0.12,
        depthWrite: false,
        side: THREE.DoubleSide
    }), []);

  const redColoring = new THREE.MeshPhongMaterial({ color:"#d90429"});
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes._________6_blinn1_0.geometry} material={redColoring} />
      <mesh geometry={nodes.body1_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.cabin_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.chair_body_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.comp_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.handls_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.keyboard_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.kovrik_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.lamp_bl_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.lamp_white_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.miuse_blinn1_0.geometry} material={redColoring} />
      <mesh geometry={nodes.monitor2_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.monitor3_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.pCylinder5_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.pillows_blinn1_0.geometry} material={redColoring} />
      <mesh geometry={nodes.polySurface53_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.radiator_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.radiator_blinn1_0001.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.railing_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.red_bttns_blinn1_0.geometry} material={redColoring} />
      <mesh geometry={nodes.stylus_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.table_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.tablet_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.triangle_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.window_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.window4_phong1_0.geometry} material={glassMat}/>
    </group>
  )
}

useGLTF.preload('/models/optimized-room.glb')
