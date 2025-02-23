import React,{useEffect} from 'react'
import axios from 'axios'

const Login = () => {
    useEffect(()=>{
        axios.post('/login')
    },[])
  return (
    <React.Fragment>
        {/* use react materialui to design the form and react hook for form validation */}
    </React.Fragment>
  )
}

export default Login