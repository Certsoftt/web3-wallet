import React from 'react'
import logo from './assets/images/logo.png'
import { useNavigate } from 'react-router-dom'
const HomeScreen = () => {
  const navigate = useNavigate()
  return (
    <React.Fragment>
        <div id="createAccount" className="home_screen_signup">
            <img src={logo} alt="logo" className="home_screen_img"/>
            <h1 className="home_title">@Makemore Wallet</h1>
            <p>
                Welcome to makemore crypto wallet exchange. The most complete DApp solution
            </p>
            <button id="openCreate" className="button3 connectWallet" onClick={()=>navigate('/signup')}>Create Account</button>
            <p>Login to your account
                <strong className="home_title" id="loginAccount" onClick={()=>navigate('/login')}> LOGIN</strong>
            </p>
        </div>
    </React.Fragment>
  )
}

export default HomeScreen