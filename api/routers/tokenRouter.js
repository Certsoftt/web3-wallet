import { db } from "../../db.js";

export const allToken = async(req, res)=>{
    await db.connect()
    .then(async(response)=>{
        console.log(response, 'DB Connected Succesfully!')
        const result = await db.query("SELECT * FROM token")
        if(result.rows.length !== 0){
          const response = result.rows 
          res.json({data: response})
        }else{
          res.json({message: [{message:"No Assets Found!"}]})
        }
    }).then(async(response)=>{
      await db.end()
    })
    .catch(error=>{
        console.log(error.message, 'DB Failed to connect')
        db.end()
    })
}

export const createToken = async(req, res)=>{
  const name = req.body.name
  const address = req.body.address
  const symbol = req.body.symbol
  const id = req.body.userId
  db.connect()
  .then(async(response)=>{
      console.log(response, 'DB Connected Succesfully!')
      const result = await db.query("INSERT INTO token (name, address, symbol) VALUES($1, $2, $3) RETURNING *", [name,address,symbol])
      const data = result.rows[0]
      res.json({data})
  })
  .catch(error=>{
      console.log(error.message, 'DB Failed to connect')
  })
}