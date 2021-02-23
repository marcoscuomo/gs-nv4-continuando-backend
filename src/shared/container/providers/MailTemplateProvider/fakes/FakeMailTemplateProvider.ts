import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProivder from '../models/IMailTemplateProvider';


class FakeMailTemplateProvider implements IMailTemplateProivder {
    public async parse(data: IParseMailTemplateDTO): Promise<string> {
        return 'Mail content';
    }
}

export default FakeMailTemplateProvider;
