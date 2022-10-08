import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
// initialize end
import { App } from 'koishi';
import * as echo from '@koishijs/plugin-echo';
import onebot from '@koishijs/plugin-adapter-onebot';
import Container from 'typedi';
import { DataSourceService } from './typeorm/data-source-service';
import { getUserInfo } from './fetch/user-info';
/**
 * bootstrap 启动服务
 */
async function bootstrap(): Promise<void> {
    const dataSource = Container.get(DataSourceService);
    await dataSource.initialize();

    const c = await dataSource.findByQid('2019033562');
    if (c != null) {
        console.log(c);
        const r = await getUserInfo(c);
        console.log(r);
    }

    // 创建一个 Koishi 应用
    const app = new App();
    // 安装 onebot 适配器插件，并配置机器人
    app.plugin(onebot, {
        protocol: 'ws',
        endpoint: 'ws://127.0.0.1:6700',
        selfId: '123456789',
    });

    app.middleware((session, next) => {
        console.log(session.content);
        if (session.content === '天王盖地虎') {
            return '宝塔镇河妖';
        } else {
            return next();
        }
    });

    // 安装 echo 插件
    app.plugin(echo);

    // 启动应用
    app.start();
}

void bootstrap();
