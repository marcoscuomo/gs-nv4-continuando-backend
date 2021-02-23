import IParseMailTemplateDTO from '../dtos/IParseMailTemplateProvider';

export default interface IMailTemplateProivder {
    parse(data: IParseMailTemplateDTO): Promise<string>;
}
