import { db } from "../../db";

export const allAccountController = ()=>{
  db.connect()
.then(async(response)=>{
    console.log(response, 'DB Connected Succesfully!')
    const result = await db.query("SELECT * FROM account")
    if(result.rows.length !== 0){
      return result.rows
    }
})
.catch(error=>{
    console.log(error.message, 'DB Failed to connect')
})
}
