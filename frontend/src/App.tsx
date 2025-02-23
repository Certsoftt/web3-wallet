import React,{useState} from 'react';
// import './alora.css'
// import HomePage from './component/alora/pages/HomePage';
import './metamaskstyles.css'
import {Route, Routes} from 'react-router-dom'
import HomeScreen from './component/metamaskwallet/HomeScreen';
import Login from './component/metamaskwallet/Login';
import CreateAccount from './component/metamaskwallet/CreateAccount';
import DashboardPage from './component/metamaskwallet/DashboardPage';
import TransferForm from './component/metamaskwallet/TransferForm';
import ImportAccount from './component/metamaskwallet/ImportAccount';
import ImportToken from './component/metamaskwallet/ImportToken';
import Header from './component/metamaskwallet/Header';
import Network from './component/metamaskwallet/Network';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RequireAuth from './component/metamaskwallet/hooks/providers/RequireAuth';
import AuthProvider from './component/metamaskwallet/hooks/providers/AuthProvider';

function App() {
  const[selectNetwork, setSelectNetwork] = useState("Ethereum Mainnet")
  const[providerURL, setProviderURL] = useState('https://rpc.ankr.com/eth/64134ef338d6d978170b7caf0277baaf6aeb94fdb35946afc24bc61ac54a5a23')
  const getSelectedNetwork = (e:React.MouseEvent<HTMLDivElement>)=>{
    setSelectNetwork(e.target.innerHTML)
    if(selectNetwork === 'Ethereum Mainnet'){
      setProviderURL('https://rpc.ankr.com/eth/64134ef338d6d978170b7caf0277baaf6aeb94fdb35946afc24bc61ac54a5a23')
    }else if(selectNetwork === 'Solana DevNet'){
      setProviderURL("https://rpc.ankr.com/solana_devnet/64134ef338d6d978170b7caf0277baaf6aeb94fdb35946afc24bc61ac54a5a23")
    }else if(selectNetwork == "Bitcoin Test Network"){
      setProviderURL("https://rpc.ankr.com/btc_signet/64134ef338d6d978170b7caf0277baaf6aeb94fdb35946afc24bc61ac54a5a23")
    }else if(selectNetwork == "BNB Test Network"){
      setProviderURL("https://rpc.ankr.com/bsc_testnet_chapel/64134ef338d6d978170b7caf0277baaf6aeb94fdb35946afc24bc61ac54a5a23")
    }else if(selectNetwork === "Sepolia Test Network"){
      setProviderURL("https://eth-sepolia.g.alchemy.com/v2/bqB1vZPzLu_lxP3JLp61PYP_paHEX9fW")
    }
  }
  return (
    <React.Fragment>
      <AuthProvider providerURL={providerURL}>
        <div className="card">
          <div className="card2">
            <Header selectedNetwork={selectNetwork}>
              <Network onClick={getSelectedNetwork}/>
            </Header>
            <Routes>
              <Route path="/" element={<HomeScreen/>}/>
              <Route path="signup" element={<CreateAccount/>}/>
              <Route path="login" element={<Login/>}/>
              <Route path="dashboard/:id" element={<RequireAuth><DashboardPage/></RequireAuth>}/>
              <Route path="dashboard/:id/transfer" element={<RequireAuth><TransferForm/></RequireAuth>}/>
              <Route path="dashboard/:id/import-account" element={<RequireAuth><ImportAccount/></RequireAuth>}/>
              <Route path="dashboard/:id/import-token" element={<RequireAuth><ImportToken/></RequireAuth>}/>
            </Routes>
          </div>
          <ToastContainer/>
        </div>
      </AuthProvider>
    </React.Fragment> 
  );
}

export default App;
