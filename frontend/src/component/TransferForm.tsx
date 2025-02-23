import React, {useState} from 'react'
import logo from './assets/images/logo.png'
import { Button, FormControl, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import {LoadingButton} from '@mui/lab'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FormValues } from './Login'
import { Lock } from '@mui/icons-material'
import { useAuth } from './hooks/providers/AuthProvider'

const TransferForm = () => {
    const auth = useAuth().user
    const providerURL = useAuth().providerURL
    const [loading, setLoading] = useState(false)
    const [link, setLink] = useState('')
    const [showLink, setShowLink] = useState(false)
    let privateKey = auth?.privatekey
    const form = useForm<FormValues>({
        defaultValues: async ()=>{
            //api call
            return {
                amount: "",
                address: "",
            }
        }
    })
    const {register,formState,handleSubmit,control} = form
    const {errors,isSubmitting,isValid, isDirty} = formState
    const handleTransfer = async (data:FormValues)=>{
        console.log(data)
        setLoading(true)
        let provider = new ethers.providers.JsonRpcProvider(providerURL)
        const wallet = new ethers.Wallet(privateKey, provider)
        const tx = {
            to: data.address,
            value: ethers.utils.parseEther(data.amount)
        }
        wallet.sendTransaction(tx).then((txObj)=>{
            console.log("txHash", txObj.hash)
            setLoading(false)
            setLink(`https://mumbai.polygonscan.com/tx/${txObj.hash}`)
            setShowLink(true)
        })
        // let formData = {
        //     address: data.address,
        //     amount: data.amount
        // }
        // let config = {
        //     method: "POST",
        //     headers:{
        //         "Content-Type": "application/json"
        //     }
        // }
        // await axios.post(`http://localhost:5000/${SERVER_TRANSFER_API}`,formData,config)
    }
  return (
    <React.Fragment>
        <Stack display="block" className="transfer_form">
            <FormControl component="form" onSubmit={handleSubmit(handleTransfer)} className="form" noValidate>
                <img src={logo} alt="logo" className="goBack" id="goBack"/>
                <Typography component="p" id="heading">Transfer Funds</Typography>
                <Stack className="field">
                    <TextField size="small" type="number" {...register("amount",{
                        required:{
                            value: true,
                            message: "Amount is required"
                        }
                    })}
                    label="Enter amount" required error={!!errors.amount} fullWidth className="input-field"
                    helperText={typeof errors.amount?.message !== "undefined"? `${errors.amount.message}`:``}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">
                                <IconButton className="input-icon" sx={{color:"rgb(0,255,200)"}}>
                                    <Lock/>
                                </IconButton>
                            </InputAdornment>
                        }
                    }}
                    />
                </Stack>
                <Typography component="p" className="space"></Typography>
                <Stack className="field">
                    <TextField className="input-field"
                    fullWidth size="small" type="text" {...register("address",{
                        required:{
                            value: true,
                            message: "Address is required"
                        }
                    })}
                    label="Enter Address" required error={!!errors.address}
                    helperText={typeof errors.address?.message !== "undefined"?`${errors.address.message}`:``}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">
                                <IconButton className="input-icon" sx={{color:"rgb(0,255,200)"}}>
                                    <Lock/>
                                </IconButton>
                            </InputAdornment>
                        }
                    }}
                    />
                </Stack>
                {loading && (
                    <Stack display="flex" id="transfer_center" className="center">
                        <Stack display="block" className="loader">
                            <Stack display="block" className="bar1"></Stack>
                            <Stack display="block" className="bar2"></Stack>
                            <Stack display="block" className="bar3"></Stack>
                            <Stack display="block" className="bar4"></Stack>
                            <Stack display="block" className="bar5"></Stack>
                            <Stack display="block" className="bar6"></Stack>
                            <Stack display="block" className="bar7"></Stack>
                            <Stack display="block" className="bar8"></Stack>
                            <Stack display="block" className="bar9"></Stack>
                            <Stack display="block" className="bar10"></Stack>
                            <Stack display="block" className="bar11"></Stack>
                            <Stack display="block" className="bar12"></Stack>
                        </Stack>
                    </Stack>
                )}
                {showLink && (
                    <small>
                        <a href={link} target="_blank">Check Your Transaction</a>
                    </small>
                )}
                {loading ?(
                    <LoadingButton type="submit" variant="outlined" id="login_up" className="button3 connectWallet" 
                    loading={loading} loadingPosition="center"
                    sx={{backgroundImage: "linear-gradient(163deg, #a00000fa 0%, #d10050 100%) !important"}}>...Wait...</LoadingButton>
                ):(
                    <Button variant="contained" className="button3 connectWallet" type="submit" disabled={!isDirty|| !isValid || isSubmitting}>Sign Up</Button>
                )}
            </FormControl>
        </Stack>
        <DevTool control={control}/>
    </React.Fragment>
  )
}

export default TransferForm