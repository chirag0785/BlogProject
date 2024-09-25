import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth'{
    interface User{
        _id?:string,
        isVerified?:boolean,
        username?:string,
        profileImg?:string
    }
    interface Session{
        user:{
            _id?:string,
            isVerified?:boolean,
            username?:string,
            profileImg?:string
        } & DefaultSession['user']
    }
    interface Profile{
        email?:string,
        name?:string,
        picture?:string,
        given_name?:string,
        email_verified?:boolean
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string,
        isVerified?:boolean,
        username?:string,
        profileImg?:string
    }
}


