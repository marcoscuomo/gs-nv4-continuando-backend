import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProiversService from '@modules/appointments/services/ListProvidersService';

export default class ProviderController {
    public async index(request: Request, response: Response): Promise<Response>{

        const user_id = request.user.id;

        const listProviders = container.resolve(ListProiversService);

        const providers = await listProviders.execute({
            user_id,
        });

        return response.json(providers);
    }
}
