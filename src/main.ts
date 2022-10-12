import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
// initialize end
import { App } from 'koishi';
import * as echo from '@koishijs/plugin-echo';
import onebot from '@koishijs/plugin-adapter-onebot';
import Container from 'typedi';
import { DataSourceService } from './typeorm/data-source-service';
import { getCharacters, getUserInfo } from './fetch/user-info';
import { writeFileSync } from 'fs';
import { PuppeteerService } from './puppeteer/puppeteer-service';
import { UserInfoPlugin } from './uid-user-info/user-info-plugin';

/**
 * bootstrap 启动服务
 */
async function bootstrap(): Promise<void> {
    // 创建一个 Koishi 应用
    const app = new App();
    // 安装 onebot 适配器插件，并配置机器人
    app.plugin(onebot, {
        protocol: 'ws',
        endpoint: 'ws://127.0.0.1:6700',
        selfId: '123456789',
    });

    // 安装 echo 插件
    app.plugin(echo);

    app.plugin(UserInfoPlugin);

    // 启动应用
    app.start();
}

void bootstrap();
