import React, {useState} from 'react'
import { useNavigate} from 'react-router-dom'
import logo from "./assets/images/logo.png"
import buy from "./assets/images/buy.png"
import send from "./assets/images/send.png"
import account from "./assets/images/user.png"
import importImg from "./assets/images/import.png"
import { useAuth } from './hooks/providers/AuthProvider'
import axios from 'axios'
import { toast } from 'react-toastify'
import {Stack, Typography} from "@mui/material"
import {v4} from "uuid"

type TokenProperties = {
    data?: Array<{
        id:string
        name:string
        address:string
        symbol:string
    }>
    message?: {message:string}[]
}

const DashboardPage = () => {
    const SERVER_TKN_API = 'api/v1/token/alltoken'
    const user = useAuth().user
    const[assets, setAssets] = useState({} as TokenProperties)
    const [balance, setBalance] = useState('')
    const navigate = useNavigate()
    const [showAsset, setShowAsset] = useState(false)
    const providerURL = useAuth().providerURL
    const provider = new ethers.providers.JsonRpcProvider(providerURL)
    provider.getBalance(user?.address).then((balance)=>{
        const balanaceInEth = ethers.utils.formatEther(balance);
        setBalance(`${balanaceInEth} ALOR`) 
    })
    // console.log(user)
    // const params = useParams()
    const handleLogout = ()=>{
        localStorage.removeItem("userWallet")
        navigate('/', {replace: true})
    }
    const openAssets = async()=>{
        await axios.get(`http://localhost:5000/${SERVER_TKN_API}`)
        .then(response=>{
            const result = response.data
            setAssets(result)
            setShowAsset(true)
            if(Object.keys(assets).includes("message")){
                toast.info("No Assets Found For This Account!", {position:"top-center"})
            }
        }).catch(error=>{
            toast.error(error.message, {position:"top-center"})
        })
    }
    const openActivity = ()=>{
        setShowAsset(false)
    }
    const copyAddress = ()=>{
        navigator.clipboard.writeText(user?.address!)
    }
  return (
    <React.Fragment>
        <Stack display="block" className="home" id="home">
            <Stack className="home_header">
                <Stack display="block">
                    <Typography component="p" id="userAddress" onClick={copyAddress}>wallet address: {user?.address.slice(0,15)}...</Typography>
                </Stack>
                <Stack display="block">
                    <Typography>Active({user?.username})</Typography>
                </Stack>
            </Stack>
            <img src={logo} alt="logo" loading="lazy" className="home_header_img"/>
            <Typography component="h1" variant="h1" id="accountBalance">{balance}</Typography>
            <Stack display="grid" className="home_features">
                <Stack display="block" className="home_feature_item">
                    <img src={buy} className="home_features_img" alt="buy cart" loading="lazy"/>
                    <Typography component="p" className="text">Buy</Typography>
                </Stack>
                <Stack display="block" className="home_feature_item" id="open_Transfer">
                    <img src={send} className="home_features_img" alt="buy cart" loading="lazy"/>
                    <Typography component="p" className="text">Send</Typography>
                </Stack>
                <Stack display="block" className="home_feature_item" id="openAccountImport">
                    <img src={account} className="home_features_img" alt="buy cart" loading="lazy"/>
                    <Typography component="p" className="text">Account</Typography>
                </Stack>
                <Stack display="block" className="home_feature_item" id="open_Import">
                    <img src={importImg} className="home_features_img" alt="buy cart" loading="lazy"/>
                    <Typography component="p" className="text">Import</Typography>
                </Stack>
            </Stack>
            <Stack display="grid" className="home_tabs">
                <Typography component="p" id="open_assets" onClick={openAssets}>Assets</Typography>
                <Typography component="p" id="logout" onClick={handleLogout}>Logout</Typography>
                <Typography component="p" id="open_activity" onClick={openActivity}>Activity</Typography>
            </Stack>
            <Typography component="p" className="space"></Typography>
            <Typography component="p" className="space"></Typography>
            {showAsset && (
                <Stack display="block" id="assets" className="assets">
                    {Object.keys(assets).includes("message") && (
                        <Typography component="p" sx={{textAlign:"center"}}>No Assets Found!</Typography>
                    )}
                    {Object.keys(assets).includes("data") && assets.data?.map((asset)=>(
                        <Stack display="grid" className="assets_item" key={v4()}>
                            <img className="assets_item_img" src={logo} alt="logo" loading="lazy"/>
                            <span>{asset.address.slice(0, 15)}... </span>
                            <span>{asset.symbol}</span>
                        </Stack>
                    ))}
                </Stack>)}
            {showAsset || (
                <Stack display="block" className="activity" id="activity">
                    <Stack display="grid" className="assets_item">
                        <img src={logo} alt="logo" loading="lazy" className="assets_item_img"/>
                        <span>333333333...</span>
                        <span>0.45 ALOR</span>
                    </Stack>
                    <Stack display="grid" className="assets_item">
                        <img src={logo} alt="logo" loading="lazy" className="assets_item_img"/>
                        <span>333333333...</span>
                        <span>0.45 ALOR</span>
                    </Stack>
                </Stack>
            )}
        </Stack>
    </React.Fragment>
  )
}

export default DashboardPage