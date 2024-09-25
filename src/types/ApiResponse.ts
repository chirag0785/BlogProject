import { Blog } from "@/model/Blog";
import { User } from "@/model/User";
import { comment } from "./comment";
import { UpcomingBadges } from "@/utils/getUpcomingBadges";

export type ApiResponse={
    success:boolean,
    message:string,
    user?:User,
    blogs?:Array<Blog>,
    blog?:Blog,
    comment?:comment,
    likes?:number,
    suggestedHeadings?:string,
    upcomingbadges?:UpcomingBadges
}