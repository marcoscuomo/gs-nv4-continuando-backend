import { container } from 'tsyringe';

import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProviders/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
