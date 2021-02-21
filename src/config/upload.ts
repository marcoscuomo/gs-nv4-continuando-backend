import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const tmpFolter = path.resolve('tmp');

export default {
    tmpFolter,
    uploadFolder: path.resolve(tmpFolter, 'uploads'),
    storage: multer.diskStorage({
        destination: tmpFolter,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        },
    }),
};
