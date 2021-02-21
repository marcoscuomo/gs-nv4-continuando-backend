import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AutenticateUserService from '@modules/users/services/AutenticateUserService';

export default class SessionsController {
    public async create(request: Request, response: Response): Promise<Response>{
        const { email, password } = request.body;

        const autenticateUserService = container.resolve(AutenticateUserService);

        const { user, token } = await autenticateUserService.execute({
            email,
            password
        });

        // @ts-expect-error
        delete user.password;

        return response.json({ user, token });
    }
}
