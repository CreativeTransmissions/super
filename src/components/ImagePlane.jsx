import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Plane, Html, Loader } from '@react-three/drei';
import * as THREE from 'three';
function ImagePlane({ index, imageUrl }) {

    const [texture, setTexture] = useState(null);

  const fetchImage = async (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
          img.crossOrigin = 'anonymous'; 

      img.onload = function() {
        // Create a canvas and get its context
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate the width to maintain aspect ratio
        const targetHeight = 126;
        const scaleFactor = targetHeight / this.height;
        const targetWidth = this.width * scaleFactor;

        // Set the canvas dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw the image onto the canvas with the desired dimensions
        ctx.drawImage(this, 0, 0, targetWidth, targetHeight);

        // Get the resulting image data
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const texture = new THREE.DataTexture(imageData.data, imageData.width, imageData.height);
        texture.needsUpdate = true;
        resolve({ dims: { width: targetWidth, height: targetHeight }, img: texture });

      }
      img.onerror = function() {
        reject(new Error(`Failed to load image's URL: ${url}`));
      }
      img.src = 'https://3desocial.com/api/image-proxy?url='+url;
    });
  }

  useEffect(() => {
    const loadImage = async () => {
      const data = await fetchImage(imageUrl);  
        setTexture(data.img);

    }
    loadImage();
  }, [imageUrl]);

  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.y += 0.01));

  return (
    <Plane args={[1, 1]} ref={mesh}>
      <meshBasicMaterial attach="material" map={texture} side={THREE.DoubleSide} />
    </Plane>
  );
}

export default ImagePlane;
