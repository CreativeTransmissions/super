import { Web3Button } from '@web3modal/react'
import { useAccount } from 'wagmi'
import { useSelector, useDispatch } from 'react-redux';
import AppCanvas from './AppCanvas';

function HomePage() {
  const data = useSelector(state => state.data);
  const dispatch = useDispatch();

  const setData = (data) => {
    dispatch({
      type: 'SET_DATA',
      data: data  // Your JSON data here
    });
  };

  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      setData({address:address});
      fetchNFTs(address).then((nftList)=>{

        parseNFTs(nftList.ownedNfts)
      })

    },
  })

    const fetchNFTs = () => {
    
      let url = constructNFTURL()
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .catch(error => {
          console.error(`Fetch error: ${error}`);
          throw error;
        });
  }
  
  const constructNFTURL =() =>{

    const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
    console.log('REACT_APP_ALCHEMY_KEY: ',alchemyKey);
    const owner = '0x154B4045F07B48C3B75D73a3f6C7C11Dfec95b4a';
    return 'https://eth-mainnet.g.alchemy.com/nft/v3/'+alchemyKey+'/getNFTsForOwner?owner='+owner+'&withMetadata=true&pageSize=100'    
  }

  const parseNFTs = (ownedNfts) => {
    console.log('parseNFTs: ',ownedNfts);
      return new Promise((resolve,reject)=>{
          // Map each nftEntry to a Promise returned by parseNFT
          const promises = ownedNfts.map(parseNFT);
      
         
          
      })
  
  }
    
  const parseNFT = async (metaData) =>{

    if(metaData.image){
        console.log('image: ',metaData.image.cachedUrl);
        //return fetchImage(metaData);
    }
    return false;
}

const fetchImage = async (metaData) => {
    let url = metaData.image;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            let width = this.width;
            let height = this.height;
            let imageData = { dims:{width:width,height:height}, img:this };
            metaData.imageData = imageData;
            resolve(metaData);
        }

        img.onerror = function() {
            reject(new Error(`Failed to load image's URL: ${url}`));
        }
        img.src = url;
    });
  }

  const { address, isConnecting, isDisconnected } = useAccount()
 
  if (isConnecting) return <div><h3>Metamask Connecting</h3></div>
  if (isDisconnected) return <div><h3>Metamask Disconnected</h3>
    <Web3Button />
  </div>
    if(address){
      return <AppCanvas/>
    } else {
        return <Web3Button />    
    }

}
export default HomePage;