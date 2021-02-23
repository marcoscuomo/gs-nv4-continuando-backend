import handlebars from 'handlebars';
import fs from 'fs';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProivder from '../models/IMailTemplateProvider';


class HandlebarsMailTemplateProvider implements IMailTemplateProivder {
    public async parse(data: IParseMailTemplateDTO): Promise<string> {

        const templateFileContent = await fs.promises.readFile(data.file, {
            encoding: 'utf-8'
        });

        const parseTempĺate = handlebars.compile(templateFileContent);

        return parseTempĺate(data.variables);
    }
}

export default HandlebarsMailTemplateProvider;
