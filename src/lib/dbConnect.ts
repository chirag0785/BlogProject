import mongoose from "mongoose";

type connectionObject={
    connection?:number
}
const dbconnection:connectionObject={}
export async function dbConnect(){
    if(dbconnection.connection){
        console.log("Already connected to database");
        return;
    }
    try{
        console.log(process.env.MONGO_URI);
        const db=await mongoose.connect(process.env.MONGO_URI || "");
        dbconnection.connection=db.connections[0].readyState;
        console.log("Db connected success");
    }catch(err){
        console.log("Connection failed to the database"); 
        process.exit(1);
    }
}