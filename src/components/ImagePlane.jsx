import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Plane} from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

function ImagePlane({ index, imageUrl, position }) {
  console.log(position);
  const texture = useLoader(TextureLoader, 'https://3desocial.com/api/image-proxy?url=' + imageUrl);
  console.log(texture)
  const mesh = useRef();
  let center = new THREE.Vector3(0,0,0);
  useFrame(() => (mesh.current.lookAt(center)))

  return (
    <Plane args={[1, 1]} ref={mesh} position={position}>
      <meshBasicMaterial attach="material" map={texture} side={THREE.DoubleSide} />
    </Plane>
  );
}

export default ImagePlane;
