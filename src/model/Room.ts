import mongoose from "mongoose";
import {Schema,Document} from "mongoose";

export interface Room extends Document{
    owner:string;
    topic:string;
    heading:string;
    accessToAll:boolean;
    editAccess:mongoose.Types.ObjectId[];
    blogId?:string;
}

const roomSchema=new Schema<Room>({
    owner:{
        type:String,
        required:true,
        ref:'User'
    },
    topic:{
        type:String,
        required:true
    },
    heading:{
        type:String,
        required:true
    },
    accessToAll:{
        type:Boolean,
        required:true
    },
    editAccess:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    blogId:{
        type:String
    }
})

const RoomModel=(mongoose.models.Room as mongoose.Model<Room>) || (mongoose.model<Room>('Room',roomSchema));
export default RoomModel;