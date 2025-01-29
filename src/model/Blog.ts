import { comment } from "@/types/comment";
import mongoose from "mongoose";
import {Schema,Document} from "mongoose";

export interface Blog extends Document{
    creator:string,
    topic:string,
    heading:string,
    content:string,
    timeToRead:string,
    likes:number,
    comments:comment[],
    createdAt:Date,
    profileImg:string,
    name:string
    editAccess:mongoose.Types.ObjectId[];
    accessToAll:boolean;
    public:boolean
}

const blogSchema=new Schema<Blog>({
    creator:{
        type:String,
        required:true,
        lowercase:true,
    },
    topic:{
        type:String,
        required:true,
        lowercase:true,
    },
    heading:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    timeToRead:{
        type:String,
        required:true,
    },
    likes:{
        type:Number,
        default:0
    },
    comments:[
        {
            username:{
                type:String,
                required:true
            },
            message:{
                type:String,
                required:true
            },
            commentedAt:{
                type:Date,
                default:Date.now,
            },
            profileImg:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    },
    profileImg:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    editAccess:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    accessToAll:{
        type:Boolean,
        required:true
    },
    public:{
        type:Boolean,
        required:true,
        default:false
    }
})

const BlogModel=(mongoose.models.Blog as mongoose.Model<Blog>) || (mongoose.model<Blog>('Blog',blogSchema));
export default BlogModel;