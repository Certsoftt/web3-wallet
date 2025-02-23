import { db } from "../../db.js";

export const allAccount = async(req, res)=>{
  try{
    await db.connect()
    .then(async(response)=>{
        console.log(response, 'DB Connected Succesfully!')
        const result = await db.query("SELECT * FROM account")
        if(result.rows.length !== 0){
          const data = result.rows
          res.json({data:data})
        }else{
          res.json({message:[{message:"No Account Found!"}]})
        }
    })
    .catch(error=>{
        console.log(error.message, 'DB Failed to connect')
    })
  }finally{
    await db.end()
  }
}

export const createAccount = async(req, res)=>{
  const privateKey = req.body.privatekey
  try{
    await db.connect()
    .then(async(response)=>{
        console.log(response, 'DB Connected Succesfully!')
        const result = await db.query("SELECT * FROM users WHERE privatekey = $1",[privateKey])
        if(result.rows.length !== 0){
          const user_data = result.rows[0]
          const id = user_data.id
          const address = user_data.address
          await db.query("INSERT INTO account (privatekey, address, user_id) VALUES($1, $2, $3) RETURNING *", [privateKey,address,id])
          .then(response=>{
            const result = response.rows[0]
            res.json({
              message: "Account Created Successfully!",
              data: result
            })
          })
          .catch(error=>{
            const err = error.message
            res.json({err})
          })
        }
    })
    .catch(error=>{
        console.log(error.message, 'DB Failed to connect')
    })
  }finally{
    await db.end()
  }
}
export const getUser = async(req, res)=>{
  const privateKey = req.body.privatekey
  try{
    await db.connect()
    .then(async(response)=>{
        console.log(response, 'DB Connected Succesfully!')
        const result = await db.query("SELECT * FROM users WHERE privatekey = $1",[privateKey])
        if(result.rows.length !== 0){
          const user_data = result.rows[0]
          res.json(user_data)
        }
    })
    .catch(error=>{
        console.log(error.message, 'DB Failed to connect')
    })
  }finally{
    await db.end()
  }
}