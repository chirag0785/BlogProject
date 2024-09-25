
import axios from "axios";

export default async function sendVerificationEmail({username,verifyCode,email}:{username:string,verifyCode:string,email:string}):Promise<any>{
    try{
      const response=await axios.post(`http://localhost:3000/api/send-verification-email`,{
        email,
        username,
        verifyCode
      })
      return response.data;

    }catch(err:any){
      console.log(err);
      throw new Error(err);
    }
}