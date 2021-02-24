import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/erros/AppError';

interface ITokenPayLoad {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction):void{

    const authHeader = request.headers.authorization;

    if(!authHeader){
        throw new AppError('Token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub } = decoded as ITokenPayLoad;

        request.user = {
            id: sub,
        };

        return next();
    }catch {
        throw new AppError('Invalid token', 401);
    }
}
