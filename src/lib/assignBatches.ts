import UserModel from "@/model/User";
import { dbConnect } from "./dbConnect";
import {badges} from "../../badges";
export async function assignBatches(userId:string){
    await dbConnect();

    try{
        const user=await UserModel.findOne({_id:userId});

        if(!user){
            throw new Error("User not found with id");
        }

        //assign word category batches

        const wordCount=user.wordCount;
        if(wordCount>=5000 && wordCount<15000){
            if(user.recentBadgeInWordsCategory!=="WordSmith-I"){
                user.recentBadgeInWordsCategory="WordSmith-I";
                user.badges.push({
                    name:"WordSmith-I",
                    imageUrl:badges["WordSmith-I"],
                    category:"WordCount",
                    assignedDate:new Date(Date.now())
                })
            }
        }

        else if(wordCount>=15000 && wordCount<30000){
            if(user.recentBadgeInWordsCategory!=="WordSmith-II"){
                user.recentBadgeInWordsCategory="WordSmith-II";
                user.badges.push({
                    name:"WordSmith-II",
                    imageUrl:badges["WordSmith-II"],
                    category:"WordCount",
                    assignedDate:new Date(Date.now())
                })
            }
        }
        else if(wordCount>=30000){
            if(user.recentBadgeInWordsCategory!=="WordSmith-III"){
                user.recentBadgeInWordsCategory="WordSmith-III";
                user.badges.push({
                    name:"WordSmith-III",
                    imageUrl:badges["WordSmith-III"],
                    category:"WordCount",
                    assignedDate:new Date(Date.now())
                })
            }
        }


        const likes=user.likes;

        if(likes>=100 && likes<300){
            if(user.recentBadgeInLikesCategory!="Popular"){
                user.recentBadgeInLikesCategory="Popular";
                user.badges.push({
                    name:"Popular",
                    imageUrl:badges["Popular"],
                    category:"Likes",
                    assignedDate:new Date(Date.now())
                })
            }
        }
        else if(likes>=300 && likes<1000){
            if(user.recentBadgeInLikesCategory!="Trending"){
                user.recentBadgeInLikesCategory="Trending";
                user.badges.push({
                    name:"Trending",
                    imageUrl:badges["Trending"],
                    category:"Likes",
                    assignedDate:new Date(Date.now())
                })
            }
        }
        else if(likes>=1000){
            if(user.recentBadgeInLikesCategory!="Iconic"){
                user.recentBadgeInLikesCategory="Iconic";
                user.badges.push({
                    name:"Iconic",
                    imageUrl:badges["Iconic"],
                    category:"Likes",
                    assignedDate:new Date(Date.now())
                })
            }
        }


        const comments=user.comments;
        if(comments>=50 && comments<100){
            if(user.recentBadgeInCommentsCategory!="Conversationalist"){
                user.recentBadgeInCommentsCategory="Conversationalist";
                user.badges.push({
                    name:"Conversationalist",
                    imageUrl:badges["Conversationalist"],
                    category:"Comments",
                    assignedDate:new Date(Date.now())
                })
            }
        }
        else if(comments>=100 && comments<500){
            if(user.recentBadgeInCommentsCategory!="Discussion Starter"){
                user.recentBadgeInCommentsCategory="Discussion Starter";
                user.badges.push({
                    name:"Discussion Starter",
                    imageUrl:badges["Discussion Starter"],
                    category:"Comments",
                    assignedDate:new Date(Date.now())
                })
            }
        }
        else if(comments>=500){
            if(user.recentBadgeInCommentsCategory!="Community Leader"){
                user.recentBadgeInCommentsCategory="Community Leader";
                user.badges.push({
                    name:"Community Leader",
                    imageUrl:badges["Community Leader"],
                    category:"Comments",
                    assignedDate:new Date(Date.now())
                })
            }
        }
        await user.save();
    }catch(err:any){
        throw new Error(err.message);
    }
}