import { LoadingButton } from '@mui/lab'
import { Button, FormControl, Stack, Typography, TextField, InputAdornment, IconButton } from '@mui/material'
import React, {useEffect, useState} from 'react'
import goBack from './assets/images/arrowleft.png'
import { FormValues } from './Login'
import { useForm } from 'react-hook-form'
import {DevTool} from "@hookform/devtools" 
import { Lock } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import {v4} from 'uuid'

type Account = {
  id: number
  user_id:number
  address: string
  privatekey:string
  message?: string
}

type AllAccount = {
  message?:{message:string}[]
  data?:Array<{
    id: number
    privatekey: string
    address: string
    user_id: number
  }>
}

const ImportAccount = () => {
  const SERVER_ACT_API = 'api/v1/account'
  const [loading, setLoading] = useState(false)
  const [newAccountCreate, setNewAccountCreate] = useState(false)
  const [newAccountData, setNewAccountData] = useState({} as Account)
  const [allAccount, setAllAccount] = useState(false)
  const [allAccountData, setAllAccountData] = useState({} as AllAccount)
  const [localstorage, setLocalStorage] = useState<null | Account>(null)
  const navigate = useNavigate()

  const changeAccount = (e: React.MouseEvent<HTMLDivElement>)=>{
    if(e.target.hasAttribute("id") && e.target.getAttribute("id") === 'list'){
      let address:string = e.target.lastElementChild.getAttribute("data-address")
      let privateKey:string = e.target.lastElementChild.getAttribute("data-privateKey")
      let formData = {
        privatekey: privateKey
      }
      let config = {
          method: "POST",
          headers:{
              "Content-Type": "application/json"
          }
      }
      axios.post(`http://localhost:5000/${SERVER_ACT_API}/getuser`, formData, config)
      .then(response=>{
        const result = response.data
        const user = result
        const userStrObj = JSON.stringify(user)
        localStorage.setItem('LoggedInUser', userStrObj)
        const userWallet = {
          address: address,
          private_key: privateKey,
          mnemonic: "Changed"
        }
        const jsonObj = JSON.stringify(userWallet)
        localStorage.setItem("userWallet", jsonObj)
        navigate(`/dashboard/${result.id}`,{replace:true})
      })
      .catch(error=>{
        toast.error(error.message, {position:"top-center"})
      })
    }
  }
  const form = useForm<FormValues>({
    defaultValues: async ()=>{
        //api call
        return {
            privatekey: ""
        }
    }
  })
  const {register,formState,handleSubmit,control} = form
  const {errors,isSubmitting,isValid, isDirty} = formState
  useEffect(()=>{
    document.addEventListener("DOMContentLoaded",()=>{
      axios.get(`http://localhost:5000/${SERVER_ACT_API}/allaccount`)
      .then(response=>{
        const result = response.data //{message: [{}]}
        setAllAccountData(result)
      })
      .catch(error=>{
        toast.error(error.message, {position:"top-center"})
      })
    })
    setLocalStorage(JSON.parse(localStorage.getItem("newAccount")!))
  })
  const handleCreate = async (data:FormValues)=>{
      console.log(data)
      let formData = {
          privatekey: data.privatekey
      }
      let config = {
          method: "POST",
          headers:{
              "Content-Type": "application/json"
          }
      }
      await axios.post(`http://localhost:5000/${SERVER_ACT_API}/createaccount`,formData,config)
      .then(response=>{
        setLoading(true)
        const result = response.data
        const data = result.data
        setNewAccountData(data)
        let str = JSON.stringify(data)
        localStorage.setItem('newAccount',str)
        toast.success(result.message, {position: "top-center"})
        setLoading(false)
      })
      .catch(error=>{
        toast.error(error.message, {position:"top-center"})
      })
  }
  return (
    <React.Fragment>
        <Stack display="block" className="import_account">
            <FormControl component="form" onSubmit={handleSubmit(handleCreate)} className="form" noValidate>
                <img id="close_import_account" className="goBack" src={goBack} alt="goback" loading="lazy" onClick={()=>navigate(-1)}/>
                <Typography component="p" id="heading">Import Account</Typography>
                <Stack className="field">
                  <TextField size="medium" type="text" {...register("privatekey",{
                        required:{
                            value: true,
                            message: "Private Key is required"
                        }
                    })}
                    label="Enter Private Key" required error={!!errors.privatekey} fullWidth className="input-field"
                    helperText={typeof errors.privatekey?.message !== "undefined"? `${errors.privatekey.message}`:``}
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
                    <Button type="submit" variant="contained" id="login_up" className="button3 connectWallet" 
                    disabled={!isDirty|| !isValid || isSubmitting}>
                        Create Account
                    </Button>
                )}
                <Button type="submit" variant="outlined" className="button3 connectWallet" onClick={()=>setNewAccountCreate(prevValue=>(!prevValue))}>
                {newAccountCreate ? "Hide New Added Account":"Show New Added Account"}
                </Button>
                {newAccountCreate && (
                  <Stack display="block">
                    <Typography sx={{textAlign: "center"}}>Created Account</Typography>
                    {localstorage
                    ?(
                      <Stack display="grid" className="lists">
                        <Typography component="p"> New </Typography>
                        <Typography component="p" className="accountValue" data-address={newAccountData.address} data-privateKey={newAccountData.privatekey}>
                            {newAccountData.address.slice(0, 25)}...
                        </Typography>
                      </Stack>
                    )
                    :(
                      <Typography component="p" gutterBottom sx={{textAlign: "center"}}>No New Account Created</Typography>
                    )}
                    
                  </Stack>
                )}
                <Button type="submit" variant="outlined" className="button3 connectWallet" onClick={()=>setAllAccount(prevValue=>(!prevValue))}>
                  {allAccount ? "Hide All Account":"Show All Account"}
                </Button>
                {allAccount && (
                  <Stack display="block" className="accountList" id="accountList" onClick={changeAccount}>
                    <Typography sx={{textAlign: "center"}}>All Accounts</Typography>
                    {Object.keys(allAccountData).includes("message") && (
                      <Typography component="p" gutterBottom sx={{textAlign: "center"}}>{allAccountData.message![0].message}</Typography>
                    )}
                    {Object.keys(allAccountData).includes("data") && allAccountData.data!.map((account, index)=>(
                        <Stack display="grid" id="list" className="lists" key={v4()}>
                          <Typography component="p"> {index + 1} </Typography>
                          <Typography component="p" className="accountValue" data-address={account.address} data-privateKey={account.privatekey}>
                              {account.address.slice(0, 25)}...
                          </Typography>
                        </Stack>
                      ))}
                  </Stack>
                )}
            </FormControl>
        </Stack> 
        <DevTool control={control}/>  
    </React.Fragment>
  )
}

export default ImportAccount