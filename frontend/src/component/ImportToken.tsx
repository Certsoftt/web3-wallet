import React, { forwardRef, useState } from 'react'
import {Button, Typography, TextField, Stack, FormControl, InputAdornment, IconButton, Snackbar, Alert, AlertProps} from "@mui/material"
import { LoadingButton } from '@mui/lab'
import goBack from './assets/images/arrowleft.png'
import {DevTool} from "@hookform/devtools"
import { FormValues } from './Login'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Lock } from '@mui/icons-material'
import { toast } from 'react-toastify'

const SERVER_TKN_API = 'api/v1/token'

type TokenData = {
    name: string
    address: string
    symbol: string
}

const ImportToken = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [tokenData, setTokenData] = useState({} as TokenData)
    const handleClose = (event?:React.SyntheticEvent | Event, reason?: string)=>{
        if(reason === "clickaway"){
            return
        }
        setOpen(false)
    }
    const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
        function SnackbarAlert(props, ref){
            return <Alert elevation={6} ref={ref} {...props}/>
        }
    )
    const form = useForm<FormValues>({
        defaultValues: async ()=>{
            //api call
            return {
                address: "",
                name: "",
                symbol: ""
            }
        }
    })
    const {register,formState, watch,handleSubmit,control} = form
    const {errors,isSubmitting,isValid, isDirty} = formState
    const CreateToken = async (data:FormValues)=>{
        console.log(data)
        let formData = {
            address: data.address,
            name: data.name,
            symbol: data.symbol,
        }
        let config = {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            }
        }
        await axios.post(`http://localhost:5000/${SERVER_TKN_API}`,formData,config)
        .then(response=>{
            setLoading(true)
            const result = response.data
            setTokenData(result)
            setOpen(true)
            setLoading(false)
        })
        .catch(error=>{
            toast.error(error.message, {position: "top-center"})
        })
    }
  return (
    <React.Fragment>
        <Stack id="import_token" className="import_token">
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                <SnackbarAlert onClose={handleClose} severity="success">
                    <Typography variant="h3"><u>Token Created</u></Typography>
                    <Typography>{tokenData.name}</Typography>
                    <Typography>{tokenData.symbol}</Typography>
                </SnackbarAlert>
            </Snackbar>
            <FormControl component="form" onSubmit={handleSubmit(CreateToken)} className="form" noValidate>
                <img alt="goback" loading="lazy" onClick={()=>navigate(-1)} src={goBack} id="goBack_import" className="goBack"/>
                <Typography component="p" id="heading">Import Token</Typography>
                <Stack className="field">
                    <TextField
                    size="small" type="text" {...register("address",{
                        required:{
                            value: true,
                            message: "Token Address is required"
                        }
                    })}
                    label="enter token address" required error={!!errors.address} fullWidth className="input-field"
                    helperText={typeof errors.address?.message !== "undefined"? `${errors.address.message}`:``}
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
                    <TextField 
                    size="small" type="type" {...register("name",{
                        disabled: watch("address") === "",
                        required:{
                            value: true,
                            message: "Token Name is required"
                        }
                    })}
                    label="Enter token name" required error={!!errors.name} fullWidth className="input-field"
                    helperText={typeof errors.name?.message !== "undefined"? `${errors.name.message}`:``}
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
                    <TextField
                    size="small" type="text" {...register("symbol",{
                        disabled: watch("name") === "",
                        required:{
                            value: true,
                            message: "Symbol is required"
                        }
                    })}
                    label="enter symbol" required error={!!errors.symbol} fullWidth className="input-field"
                    helperText={typeof errors.symbol?.message !== "undefined"? `${errors.symbol.message}`:``}
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
                {loading ?(
                    <LoadingButton type="submit" variant="outlined" id="login_up" className="button3 connectWallet" 
                loading={loading} loadingPosition="center"
                sx={{backgroundImage: "linear-gradient(163deg, #a00000fa 0%, #d10050 100%) !important"}}>...Wait...</LoadingButton>
                ):(
                    <Button type="submit" variant="contained" className="button3 connectWallet" 
                    disabled={!isDirty|| !isValid || isSubmitting}>
                        Create Token
                    </Button>
                )}
            </FormControl>
        </Stack>
        <DevTool control={control}/>
    </React.Fragment>
  )
}

export default ImportToken