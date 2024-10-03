
import axios from "axios";

export default async function sendVerificationEmail({username,verifyCode,email}:{username:string,verifyCode:string,email:string}):Promise<any>{
    try{
      const response=await axios.post(process.env.BASE_URL+`/api/send-verification-email`,{
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