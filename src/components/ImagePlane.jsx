import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Plane, Html, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

function ImagePlane({ index, imageUrl }) {
  const texture = useLoader(TextureLoader, 'https://3desocial.com/api/image-proxy?url=' + imageUrl);

  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.y += 0.01));

  return (
    <Plane args={[1, 1]} ref={mesh}>
      <meshBasicMaterial attach="material" map={texture} side={THREE.DoubleSide} />
    </Plane>
  );
}

export default ImagePlane;
