import { Inject, Service } from 'typedi';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from './config-service';
import { Cookie } from './entities/cookies.entity';
/**
 * dataSourceService
 */
@Service()
export class DataSourceService {
    dataSource!: DataSource;
    constructor(config: ConfigService) {
        this.dataSource = new DataSource({
            type: 'better-sqlite3',
            database: config.get<string>('MYSQL_DATABASE'),
            entities: [__dirname + '/../**/*.entity.{js,ts}'],
            synchronize: true,
        });
        this.dataSource
            .initialize()
            .then(() => {
                // here you can start to work with your database
                console.log('initialize');
            })
            .catch((error) => console.log(error));
    }

    /**
     *  initialize
     */
    async initialize(): Promise<void> {
        await this.dataSource.initialize();
    }

    async findByQid(id: string | number): Promise<Cookie> {
        const query = this.dataSource.manager.createQueryBuilder(Cookie, 'cookie').where('cookie.qid = :id', { id });
        const c = await query.getOne();

        if (c == null) throw new Error(`NOT FOUND`);
        return c;
    }
}
