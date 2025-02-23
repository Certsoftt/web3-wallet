import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import fs from 'fs'
// import {db} from './db.js'
// import axios from 'axios'
import session from 'express-session'
import passport from 'passport'
import { allAccount, createAccount } from './api/routers/accountRouter.js'
import { allToken, createToken } from './api/routers/tokenRouter.js'
import { login, signup } from './api/routers/userRouter.js'

dotenv.config({path: './.env'})

export const port = process.env.PORT
export const host = process.env.HOST
const USR_API_URL = '/api/v1/user'
const ACT_API_URL = '/api/v1/account'
const TKN_API_URL = '/api/v1/tokens'
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

// middleware
app.use(session({
    secret: "MySecret123%",
    resave:false,
    saveUnintialized:true,
    cookie:{
        maxAge:1000*60*60*24*7
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json({limit:'100kb'}))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'../', 'assets')))

// handlers
//display popup.html
app.get('/', (req, res)=>{
    console.log(req.url)
    console.log(__dirname)
    res.writeHead(200, {'content-type':'text/html'})
    const myReadStream = fs.createReadStream(path.join(__dirname,'../','popup.html'), 'utf8')
    myReadStream.pipe(res)
})
// account
app.get(`${ACT_API_URL}/allaccount`, allAccount)
app.post(`${ACT_API_URL}/createaccount`, createAccount)

//token
app.get(`${TKN_API_URL}/alltoken`, allToken)
app.post(`${TKN_API_URL}/createtoken`, createToken)

//user
app.post(`${USR_API_URL}/signup`, signup)
app.post(`${USR_API_URL}/login`, login)

app.listen(port, host, ()=>{
    console.log(`server started on ${process.env.NODE_ENV} on port ${port}. Visit: http://${host}:${port}`)
})