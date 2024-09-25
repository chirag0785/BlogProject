import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:'Credentials',
            credentials:{
                email:{label:"Email or Username",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try{
                    const user=await UserModel.findOne({
                        $or:[
                            {username:credentials.identifier},
                            {email:credentials.identifier}
                        ]
                    })

                    if(!user){
                        
                        throw new Error("No user found with this email or username");
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account before login");
                    }


                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password);

                    if(!isPasswordCorrect){
                        throw new Error("Invalid password");
                    }
                    return user;
                }catch(err:any){
                    throw new Error(err)
                }
            },
        }),

        GoogleProvider({
            clientId:process.env.GOOGLE_ID || "",
            clientSecret:process.env.GOOGLE_SECRET || ""
        })
        
    ],

    callbacks:{
        async jwt({token,user,account,profile,trigger,session}){
            if(user){   //for credential provider
                token._id=user._id?.toString();
                token.isVerified=user.isVerified;
                token.username=user.username;
                token.profileImg=user.profileImg;
                token.email=user.email;
            }

            if(account?.provider==='google' && profile?.email){ //for google provider
                try{
                    
                    const user=await UserModel.findOne({
                        email:profile?.email
                    })
                    
                    
                    if(user){
                        token._id=user._id?.toString();
                        token.isVerified=user.isVerified;
                        token.username=user.username;
                        token.profileImg=user.profileImg;
                        token.email=user.email;
                    }
                }catch(err:any){
                    console.error('Error handling Google sign-in along with jwt:', err);
                    throw new Error(err.message);
                }
            }

            if(trigger==='update'){
                token.username=session.user.username;
            }
            return token;
        },
        async session({session,token,user}){
            if(token){
                session.user._id=token._id;
                session.user.isVerified=token.isVerified;
                session.user.profileImg=token.profileImg;
                session.user.username=token.username;
            }
            
            return session;
        },
        async signIn({account,profile}){
            if(account?.provider==='google'){
                //first add the information to the database
                if(!profile?.email_verified) return false;
                await dbConnect();
                
                try{
                    
                    const user=await UserModel.findOne({
                        email:profile?.email
                    })
                    
                    
                    if(user){
                        return true;
                    }
                
                    
                    const newUser=await UserModel.create({
                        username:"#",
                        email:profile?.email,
                        isVerified:profile?.email_verified,
                        name:profile?.name,
                        profileImg:profile?.picture
                    });

                    return true;
                }catch(err){
                    console.error('Error handling Google sign-in:', err);
                    return false;
                }
            }
            return true;
        }
    }, 
    pages:{
        signIn:'/sign-in',
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
}