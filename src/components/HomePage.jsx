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
      data: data
    });
  };

  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {

      fetchNFTs(address).then((nftList)=>{
        if(nftList.ownedNfts.length > 0){
          setData({address:address,
            nftList:nftList});   
        } else {
          // test code- use test wallet if no nfts
          console.log('no nfts using test');
           address = process.env.REACT_APP_TEST_WALLET_ADDRESS;

          fetchNFTs(address).then((nftList)=>{
            if(nftList.ownedNfts.length > 0){
              setData({address:address,
                nftList:nftList});   
            } 
         
    
          })
    
        }
     

      })

    },
  })

    const fetchNFTs = (owner) => {

      let url = constructNFTURL(owner)
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
  
  const constructNFTURL =(owner) =>{

    const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;


  //  const owner = process.env.REACT_APP_TEST_WALLET_ADDRESS;
    return 'https://eth-mainnet.g.alchemy.com/nft/v3/'+alchemyKey+'/getNFTsForOwner?owner='+owner+'&withMetadata=true&pageSize=100'    
  }

  const { address, isConnecting, isDisconnected } = useAccount()
 
  if (isConnecting) return <div id="connect"><h3>Metamask Connecting...</h3></div>
  if (isDisconnected) return <div id="connect"><h3>Conect with Metamask</h3>
    <Web3Button />
  </div>
    if(address){
      return <AppCanvas/>
    } else {
        return <Web3Button />    
    }

}
export default HomePage;