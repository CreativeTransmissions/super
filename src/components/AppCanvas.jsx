import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Plane, Html, Loader } from '@react-three/drei';
import { TextureLoader } from 'three';

function ImagePlane() {
  const ipfsHash = 'Qm...'; // replace with your hash
  const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

  const texture = useLoader(TextureLoader, url);
  
  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.y += 0.01));

  return (
    <Plane args={[5, 5]} ref={mesh}>
      <meshBasicMaterial attach="material" map={texture} />
    </Plane>
  );
}

function AppCanvas() {
  return (
    <Canvas style={{ background: 'black', width: "100vw", height: "100vh"  }}>
    </Canvas>
  );
}

export default AppCanvas;