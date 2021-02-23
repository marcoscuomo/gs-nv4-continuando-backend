import IParseMailTemplateDTO from '../dtos/IParseMailTemplateProvider';
import IMailTemplateProivder from '../models/IMailTemplateProvider';


class FakeMailTemplateProvider implements IMailTemplateProivder {
    public async parse(data: IParseMailTemplateDTO): Promise<string> {
        return data.template;
    }
}

export default FakeMailTemplateProvider;
