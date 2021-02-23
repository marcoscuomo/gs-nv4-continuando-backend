import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateProvider';

interface IMailContact {
    name: string;
    email: string;
}

export default interface ISendMailDTO {
    to: IMailContact,
    from?: IMailContact,
    subject: string,
    templateData: IParseMailTemplateDTO;
}
