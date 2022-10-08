import 'reflect-metadata';
import { Service } from 'typedi';
// import * as dotenv from 'dotenv';
// dotenv.config();
/**
 * ConfigService
 */
@Service()
export class ConfigService {
    /**
     * get
     */
    get<T extends string | number>(propertyPath: string, defaultValue?: string): T {
        return (process.env[propertyPath] as T) ?? (defaultValue as T);
    }
}
