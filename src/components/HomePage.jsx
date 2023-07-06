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
        setData({address:address,
                  nftList:nftList});        

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
    const owner = process.env.REACT_APP_TEST_WALLET_ADDRESS;
    return 'https://eth-mainnet.g.alchemy.com/nft/v3/'+alchemyKey+'/getNFTsForOwner?owner='+owner+'&withMetadata=true&pageSize=100'    
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