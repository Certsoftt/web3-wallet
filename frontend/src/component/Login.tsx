import React, { useState } from 'react'
import logo from './assets/images/logo.png'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth} from './hooks/providers/AuthProvider'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Lock, MailLock,Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { Button, FormControl, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { DevTool } from '@hookform/devtools'
import {LoadingButton} from '@mui/lab'

const SERVER_LOGIN_API = 'api/v1/user/login'

export type PasswordSwitchType = {
    type: string
    visibility: React.ReactNode
}
export type HandleView = {
    password:PasswordSwitchType
    viewPassword:PasswordSwitchType
}
export type FormValues = {
    email?: string
    password?:string
    username?: string
    confirmPassword?: string
    mnmonic?: string
    address?: string
    privatekey?: string
    amount?: string
    name?: string
    symbol?: string
    id?: number
}

const passwordState: HandleView = {
    password:{
        type: "password",
        visibility:<Visibility/>
    },
    viewPassword:{
        type:"text",
        visibility: <VisibilityOff/>
    }
}

const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const auth = useAuth()
    const location = useLocation()
    const redirectpath = location.state?.path
    const [passwordView, setPasswordView]=useState({type:"password",visibility:<Visibility/>} as PasswordSwitchType)
    const form = useForm<FormValues>({
        defaultValues: async ()=>{
            //api call
            return {
                email: "",
                password: "",
            }
        }
    })
    const {register,formState, watch,handleSubmit,control} = form
    const {errors,isSubmitting,isValid, isDirty} = formState
    const handlePasswordView = ()=>{
        if(passwordView.type === "password"){
            setPasswordView(
                passwordState.viewPassword
            )
        }else{
            setPasswordView(
                passwordState.password
            )
        }
    }
    const handleLogin = async (data:FormValues)=>{
        console.log(data)
        let formData = {
            email: data.email,
            password: data.password
        }
        let config = {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            }
        }
        await axios.post(`http://localhost:5000/${SERVER_LOGIN_API}`,formData,config)
        .then((response)=>{
            const result = response.data
            console.log(result)
            if(Object.keys(result).includes("error")){
                toast.error(result.error, {position:"top-right"})
            }else{
                const userWallet = {
                    address: result.address,
                    private_key: result.privatekey,
                    mnemonic: result.mnmonic
                }
                const user = result
                console.log(userWallet)
                const jsonObj = JSON.stringify(userWallet)
                const userStrObj = JSON.stringify(user)
                localStorage.setItem('userwallet', jsonObj)
                localStorage.setItem('LoggedInUser', userStrObj)
                setLoading(true)
                auth.login(result)
                toast.success('Login Successfully', {position:"top-center"})
                setLoading(false)
                if(redirectpath){
                    navigate(redirectpath, {replace: true})
                }else{
                    navigate(`/dashboard/${result.id}`,{replace:true})
                }
            }
            
        })
        .catch(err=>{
            setLoading(true)
            toast.error(err.message, {position:"top-center", autoClose:6000})
            setTimeout(()=>{
                setLoading(false)
            }, 7000)
        })
    }
  return (
    <React.Fragment>
        <Stack display="block" id="LoginUser" className="home_screen_login">
            <img alt="logo" loading="lazy" src={logo} className="home_screen_img"/>
            <Typography variant="h1" component="h1" className="home_title" gutterBottom>@MakeMore</Typography>
            <Typography component="p" gutterBottom>Welcome back! The decentralized web DApp</Typography>
            <FormControl component="form" onSubmit={handleSubmit(handleLogin)} className="form" noValidate>
                <Stack className="field">
                    <TextField size="small" type="email" {...register("email",{
                        required:{
                            value: true,
                            message: "Email is required"
                        },
                        pattern:{
                            value:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9-]+)*$/,
                            message:" invalid email"
                        }
                    })}
                    label="Enter email" required error={!!errors.email} fullWidth className="input-field"
                    helperText={typeof errors.email?.message !== "undefined"? `${errors.email.message}`:``}
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">
                                <IconButton className="input-icon" sx={{color:"rgb(0,255,200)"}}>
                                    <MailLock/>
                                </IconButton>
                            </InputAdornment>
                        }
                    }}
                    sx={{color:"rgb(236, 232, 232) !important"}}/>
                </Stack>
                <Stack className="field">
                    <TextField size="small" fullWidth className='input-field' type={passwordView.type} {...register("password",{
                        disabled: watch("email") === "",
                        required:{
                            value: true,
                            message: "is required"
                        },
                        validate:{
                            passwordLength: (fieldValue)=>(
                                fieldValue!.length >= 8 || 'Password must be 8 characters or more'
                            )
                        }
                    })}
                    label="Enter Password" required error={!!errors.password}
                    helperText={typeof errors.password?.message !== "undefined"?`${errors.password.message}`:``}
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end" onClick={handlePasswordView}>
                                <IconButton className="input-icon"sx={{color:"rgb(0,255,200)"}}>
                                    {passwordView.visibility}
                                </IconButton>
                            </InputAdornment>,
                            startAdornment: <InputAdornment position="start">
                                <IconButton className="input-icon"sx={{color:"rgb(0,255,200)"}}>
                                    <Lock/>
                                </IconButton>
                            </InputAdornment>
                        }
                    }}
                    sx={{color:"rgb(0,255,200)"}}/>
                </Stack>
                {loading ?(
                    <LoadingButton type="submit" variant="outlined" id="login_up" className="button3 connectWallet" 
                loading={loading} loadingPosition="center"
                sx={{backgroundImage: "linear-gradient(163deg, #a00000fa 0%, #d10050 100%) !important"}}>...Wait...</LoadingButton>
                ):(
                    <Button type="submit" variant="contained" id="login_up" className="button3 connectWallet" 
                    disabled={!isDirty|| !isValid || isSubmitting}>
                        Login
                    </Button>
                )}
                
                <Typography component="p">Login To Your Account or</Typography>
                <strong className="home_title" id="accountCreate" onClick={()=>navigate('/signup')}>Create Account</strong>
            </FormControl>
            <DevTool control={control}/>
        </Stack>
    </React.Fragment>
  )
}

export default Login