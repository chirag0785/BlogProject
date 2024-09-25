
type badgeCategories="WordCount"|"Likes"| "Comments";
export interface BadgeInfo{
    badgeName:string,
    progress:number;
}
export interface UpcomingBadges{
    [key : string]:BadgeInfo
}
export function getUpcomingBadges({wordCount,likes,comments}:{wordCount:number,likes:number,comments:number}):UpcomingBadges{
    //upcoming badge for WordCount
        
        const upcomingBadge: Record<badgeCategories, BadgeInfo> = {
            "WordCount": { badgeName: "", progress: 0 },
            "Likes": { badgeName: "", progress: 0 },
            "Comments": { badgeName: "", progress: 0 }
        };
        if(wordCount>=0 && wordCount<5000){
            const progress=100*((wordCount-0)/5000);
            upcomingBadge["WordCount"]={badgeName:"WordSmith-I",progress}
        }

        else if(wordCount>=5000 && wordCount<15000){
            const progress=100*((wordCount-5000)/10000);
            upcomingBadge["WordCount"]={badgeName:"WordSmith-II",progress}
        }
        else if(wordCount>=15000 && wordCount<30000){
            const progress=100*((wordCount-15000)/15000);
            upcomingBadge["WordCount"]={badgeName:"WordSmith-III",progress}
        }




        if(likes>=0 && likes<100){
            const progress=100*((likes-0)/100);
            upcomingBadge["Likes"]={badgeName:"Popular",progress}
        }
        else if(likes>=100 && likes<300){
            const progress=100*((likes-100)/200);
            upcomingBadge["Likes"]={badgeName:"Trending",progress}
        }
        else if(likes>=300 && likes<1000){
            const progress=100*((likes-300)/700);
            upcomingBadge["Likes"]={badgeName:"Iconic",progress}
        }



        if(comments>=0 && comments<50){
            const progress=100*((comments-0)/50);
            upcomingBadge["Comments"]={badgeName:"Conversationalist",progress}
        }
        else if(comments>=50 && comments<100){
            const progress=100*((comments-50)/50);
            upcomingBadge["Comments"]={badgeName:"Discussion Starter",progress}
        }
        else if(comments>=100 && comments<500){
            const progress=100*((comments-100)/400);
            upcomingBadge["Comments"]={badgeName:"Community Leader",progress}
        }

        return upcomingBadge;
}