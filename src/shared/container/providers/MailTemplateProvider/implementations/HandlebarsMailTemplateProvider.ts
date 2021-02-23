import handlebars from 'handlebars';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateProvider';
import IMailTemplateProivder from '../models/IMailTemplateProvider';


class HandlebarsMailTemplateProvider implements IMailTemplateProivder {
    public async parse(data: IParseMailTemplateDTO): Promise<string> {
        const parseTempĺate = handlebars.compile(data.template);

        return parseTempĺate(data.variables);
    }
}

export default HandlebarsMailTemplateProvider;
