import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Canvas, useFrame } from '@react-three/fiber';
import ImagePlane from './ImagePlane';
import { OrbitControls, perspectiveCamera  } from '@react-three/drei';


function AppCanvas() {
    const cameraRef = useRef();
    
    const parseNFTs = (ownedNfts) => {
        return new Promise((resolve,reject)=>{
            // Map each nftEntry to a Promise returned by parseNFT
            const promises = ownedNfts.map(parseNFT);

            Promise.allSettled(promises)
            .then(results => {
                const successfulPromises = results.filter(result => result.status === 'fulfilled' && result.value !== false);
                resolve(successfulPromises.map(promise => promise.value));
            })
            .catch(error => {
              console.error('Error processing promises:', error);
            });            
        })
    
    }
      
    const parseNFT = async (metaData) =>{
    
      if(metaData.image){
        let imgUrl = (metaData.image.cachedUrl)?metaData.image.cachedUrl:(metaData.image.originalUrl)?metaData.image.originalUrl:null;
          if(imgUrl){
            return imgUrl;
          }
      }
      return false;
    }

    const [imageUrls, setImageUrls] = useState([]);

    let nftList = useSelector((state) => state.data.nftList);

    useEffect(() => {
        if (nftList) {
          parseNFTs(nftList.ownedNfts).then((urls) => {
            setImageUrls(urls);
          });
        }
      }, [nftList]); // Only re-run the effect if nftList changes
      
  const radius = 5;
  const angleIncrement = (2 * Math.PI) / imageUrls.length;
    return (
            <Canvas style={{ background: 'black', width: "100vw", height: "100vh"  }}>

            {imageUrls.map((url, index, array) => {
              const angle = index * angleIncrement;
              const position = [
                radius * Math.cos(angle),
                0,
                radius * Math.sin(angle),
              ];
    
                return <ImagePlane key={index} imageUrl={url} position={position} />
            })}

            <OrbitControls
            autoRotate={true}
            target0={[0,0,0]}
            zoom0={0}
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 2} // Lock vertical rotation
            maxPolarAngle={Math.PI / 2} // Lock vertical rotation
            args={[cameraRef.current, document.documentElement]}
            />

            <perspectiveCamera 
            ref={cameraRef}
            position={[0, 0, 0]}
            fov={75}
            near={0.1}
            far={1000}
            />
      </Canvas>
        
    )
}

export default AppCanvas;