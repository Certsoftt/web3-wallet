import { db } from "../../db.js";
import bcryptjs from 'bcryptjs'

const saltRounds = 12;
export const signup = async(req, res)=>{
  try{
    db.connect()
    .then(async(response)=>{
        console.log(response, 'DB Connected Succesfully!')
        const input = req.body.username
        const email = req.body.email
        const password = req.body.password
        const privateKey = req.body.privatekey
        const address = req.body.address
        const mnemonic = req.body.mnmonic

        const result = await db.query("SELECT * FROM users where username LIKE $1 || '%'", [input])
        if(result.rows.length !== 0){
        res.json({error: "username already in used"})
        }else{
          const result = await db.query("SELECT * FROM users where email LIKE $1 || '%'", [email])
          if(result.rows.length !== 0){
              res.json({error: "email already in used"})
          }else{
              bcryptjs.hash(password, saltRounds, async(err, hash)=>{
                  if(err){
                      console.log(err.message, "Error from bcrypt")
                  }else{  
                      db.query("INSERT INTO users (username, email, password, privatekey, address, mnmonic) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",[input,email,hash,privateKey,address,mnemonic])
                      .then(response=>{
                          const user = response.rows[0]
                          res.json(user)
                      })
                      .catch(err=>{
                          console.log(err.message)
                      })
                  }
              })
          }
        }
    })
    .catch(error=>{
        console.log(error.message, 'DB Failed to connect')
    })
  }
  finally{
    // db.end()
  }
    
}

export const login = async(req, res)=>{
  try{
    await db.connect()
    .then(async(response)=>{
        console.log(response, 'DB Connected Succesfully!')
        console.log(req.body)
        const email = req.body.email
        const password = req.body.password
        const result = await db.query("SELECT * FROM users where email LIKE $1 || '%'", [email])
        if(result.rows.length === 0){
          res.json({error: "Provided Credentials are invalid!"})
          // console.log("Provided Credentials are invalid!")
          
        }else{
          await db.query("SELECT * FROM users where email LIKE $1 || '%'", [email])
          .then(response=>{
            const databasePassword = response.rows[0].password
            bcryptjs.compare(password, databasePassword, async (err, result)=>{
              if(err){
                res.json({error:err.message})
              }else{
                if(result){
                  await db.query("SELECT * FROM users where email LIKE $1 || '%'", [email])
                  .then(async(response)=>{
                    const user = response.rows[0]
                    // const result = await db.query("SELECT * FROM users")
                    // console.log(result.rows)
                    res.json(user)
                    
                  })
                  .catch(err=>{
                    res.json({error: err.message})
                  })
                }else{
                  res.json({error:"Provided Credentials are invalid!"})
                }
              }
            })
          })
          .catch(err=>{
            res.json({error:err.message})
          })
        }
    })
    .catch(error=>{
      console.log(`${error.message} DB Failed to connect`)
    })
  }
  finally{
    // await db.end()
  }
  
}