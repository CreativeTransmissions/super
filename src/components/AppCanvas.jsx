import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Canvas } from '@react-three/fiber';
import ImagePlane from './ImagePlane';

function AppCanvas() {

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
      

    return (
        <div>
        <Canvas style={{ background: 'black', width: "100vw", height: "100vh"  }}>
            {imageUrls.length > 0 && <ImagePlane key={0} imageUrl={imageUrls[0]} />}
        </Canvas>
        {imageUrls.length > 0 && <img src={'https://3desocial.com/api/image-proxy?url='+imageUrls[0]} alt="preview" />} 
        </div>
        )
}

export default AppCanvas;