export class LoginRequest{
    username:string;
    password:string;
}

export class User {
    uid?: number;
    username?: string;
    password?: string;
    registerTime?: number;
    email?: string;
    emailCode?: string;
    portrait?: string;
    authorities?: string[];
}

export class LoginResponse{
    code:number;
    msg:string;
    token:string;
    jwtUser:User;
}

export class Auth{
    user?: User;
    hasError: boolean;
    errMsg: string;
    redirectUrl: string;
    token:string;
    expDuration:number = 604800000;
}

