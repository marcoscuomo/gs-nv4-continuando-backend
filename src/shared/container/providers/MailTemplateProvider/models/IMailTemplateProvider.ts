import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProivder {
    parse(data: IParseMailTemplateDTO): Promise<string>;
}
