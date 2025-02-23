import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {Button, FormControl, IconButton, InputAdornment, Stack, TextField, Typography} from "@mui/material"
import { useAuth } from './hooks/providers/AuthProvider'
import { useForm } from 'react-hook-form'
import { FormValues, HandleView, PasswordSwitchType } from './Login'
import { VerifiedUser, MailLock, Visibility, VisibilityOff, Lock } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { DevTool } from '@hookform/devtools'
import axios from 'axios'

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
const SERVER_SIGNUP_API = 'api/v1/user/signup'

const CreateAccount = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
        const auth = useAuth()
        const location = useLocation()
        const redirectpath = location.state?.path
        const [passwordView, setPasswordView]=useState({type:"password",visibility:<Visibility/>} as PasswordSwitchType)
        const [confirmPasswordView, setConfirmPasswordView]=useState({type:"password",visibility:<Visibility/>} as PasswordSwitchType)
        const form = useForm<FormValues>({
            defaultValues: async ()=>{
                //api call
                return {
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    mnmonic: "",
                    address:"",
                    privatekey:""
                }
            }
        })
        const {register,formState, watch,handleSubmit,control} = form
        const {errors,isDirty,isValid,isSubmitting} = formState
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
        const handleConfirmPasswordView = ()=>{
            if(confirmPasswordView.type === "password"){
                setConfirmPasswordView(
                    passwordState.viewPassword
                )
            }else{
                setConfirmPasswordView(
                    passwordState.password
                )
            }
        }
        const handleSignup = async (data:FormValues)=> {
            let wallet = ethers.Wallet.createRandom();
            let formData = {
                email: data.email,
                password: data.password,
                username: data.username,
                mnmonic: wallet.mnemonic.phrase,
                address: wallet.address,
                privatekey: wallet.privateKey
            }
            let config = {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                }
            }
            await axios.post(`http://localhost:5000/${SERVER_SIGNUP_API}`,formData,config)
            .then((response)=>{
                const result = response.data
                // console.log(result)
                if(Object.keys(result).includes("error")){
                    toast.error(result.error, {position:"top-right"})
                }else{
                    const userWallet = {
                        address: result.address,
                        private_key: result.privatekey,
                        mnemonic: result.mnmonic
                    }
                    // console.log(userWallet)
                    const user = result
                    const userStrObj = JSON.stringify(user)
                    const jsonObj = JSON.stringify(userWallet)
                    localStorage.setItem('LoggedInUser', userStrObj)
                    localStorage.setItem('userwallet', jsonObj)
                    setLoading(true)
                    auth.login(result)
                    toast.success('SignUp Successfully', {position:"top-center"})
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
        <Stack display="block" id="create_popUp" className="create_popup">
            <FormControl component="form" noValidate className="form" onSubmit={handleSubmit(handleSignup)} method="post">
                <Typography component="p" id="heading">Create Account</Typography>
                <Stack id="field">
                    <Stack className="field">
                        <TextField type="text" className="input-field" id="sign_up_name" fullWidth size="small" {...register("username",{
                            required:{
                                value: true,
                                message: "username is required"
                            },
                            validate:{
                                usernameLength:(fieldValues)=>(
                                    fieldValues!.length >= 5 || 'Username must be 5 characters or more'
                                ),
                                notAdmin: (fieldValues)=>(
                                    fieldValues?.toLowerCase().includes('admin') || "Username must not contain admin"
                                )
                            }
                        })}
                        label="Enter Username" error={!!errors.username} required
                        helperText={typeof errors.username?.message !== "undefined"? `${errors.username.message}`:``}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">
                                    <IconButton className="input-icon" sx={{color:"rgb(0,255,200)"}}>
                                        <VerifiedUser/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        }}
                        />
                    </Stack>
                    <Typography component="p" className="space"></Typography>
                    <Stack className="field">
                        <TextField className="input-field" id="sign_up_email"
                        fullWidth size="small" type="email" {...register("email",{
                            disabled: watch("username")==="",
                            required:{
                                value: true,
                                message: "email is required"
                            },
                            pattern:{
                                value:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9-]+)*$/,
                                message:" invalid email"
                            },
                            validate:{
                                notAdmin: (fieldValue)=>(
                                    fieldValue?.toLowerCase().includes('admin') || "Email must not contain admin"
                                )
                            }
                        })}
                        label="Enter email" required error={!!errors.email}
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
                        />
                    </Stack>
                    <Typography component="p" className="space"></Typography>
                    <Stack className="field">
                        <TextField className="input-field" id="sign_up_password"
                        size="small" fullWidth type={passwordView.type} {...register("password",{
                            disabled: watch("email") === "",
                            required:{
                                value: true,
                                message: "password is required"
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
                        <TextField className="input-field" id="sign_up_password"
                        fullWidth size="small" type={confirmPasswordView.type} {...register("confirmPassword",{
                            disabled: watch("password")==="",
                            required:{
                                value: true,
                                message: "confirm password is required"
                            },
                            validate:{
                                similarPassword: (fieldValue)=>(
                                    fieldValue === watch("password") || 'Password must be 8 characters or more'
                                )
                            }
                        })}
                        label="Confirm Password" required error={!!errors.confirmPassword}
                        helperText={typeof errors.confirmPassword?.message !== "undefined"?`${errors.confirmPassword.message}`:``}
                        slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end" onClick={handleConfirmPasswordView}>
                                    <IconButton className="input-icon" sx={{color:"rgb(0,255,200)"}}>
                                        {confirmPasswordView.visibility}
                                    </IconButton>
                                </InputAdornment>,
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
                </Stack>
                {loading && (
                    <React.Fragment>
                        <Stack display="block" id="center" className="center">
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
                        <Stack display="block" id="accountData" className="accountData">
                            <Typography variant="h3" id="accountInfo">Address</Typography>
                            <Typography component="p" id="createdAddress">Address:</Typography>
                            <Typography variant="h3">Private Key</Typography>
                            <Typography component="p" id="createdPrivateKey">Private Key:</Typography>
                            <Typography variant="h3">Mnemonic</Typography>
                            <Typography component="p" id="createdMnemonic">Mnemonic:</Typography>
                        </Stack>
                    </React.Fragment>
                )}
                {loading ?(
                    <LoadingButton type="submit" variant="outlined" id="login_up" className="button3 connectWallet" 
                   loading={loading} loadingPosition="center"
                   sx={{backgroundImage: "linear-gradient(163deg, #a00000fa 0%, #d10050 100%) !important"}}>...Wait...</LoadingButton>
                ):(
                <Button variant="contained" id="sign_up" className="button3 connectWallet" type="submit" disabled={!isDirty|| !isValid || isSubmitting}>Sign Up</Button>
                )}
                <p>OR</p>
                <Button variant="outlined" id="goHomePage" className="button3 connectWallet" onClick={()=>navigate('/login')}>Login</Button>
            </FormControl>
        </Stack>
        <DevTool control={control}/>
    </React.Fragment>
  )
}

export default CreateAccount