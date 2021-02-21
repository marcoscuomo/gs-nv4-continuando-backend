import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppintmentsController {
    public async create(request: Request, response: Response): Promise<Response>{
        const { provider_id, date } = request.body;

        const parseDate = parseISO(date);

        const createAppointmentService = container.resolve(CreateAppointmentService);

        const appointment = await createAppointmentService.execute({date: parseDate, provider_id});

        return response.json(appointment);
    }
}
