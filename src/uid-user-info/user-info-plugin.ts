import { Context, segment, Session } from 'koishi';
import { getCharacters, getUserInfo } from 'src/fetch/user-info';
import { PuppeteerService } from 'src/puppeteer/puppeteer-service';
import { DataSourceService } from 'src/typeorm/data-source-service';
import Container from 'typedi';

const dataSource = Container.get(DataSourceService);
const puppeteer = Container.get(PuppeteerService);

export class UserInfoPlugin {
    constructor(ctx: Context) {
        ctx.command('uidd').action(async (_, _message) => {
            const { session } = _;
            return await this.action({ session });
        });
    }

    async action({ session }: { session: Session }): Promise<string | void | segment> {
        const cookie = await dataSource.findByQid(session.userId);
        console.log(cookie);
        if (cookie != null) {
            const info = await getUserInfo(cookie);
            const ids = info.data.avatars.map((i) => i.id);
            const characters = await getCharacters(cookie, ids);
            const i = JSON.stringify({
                uid: cookie.uid,
                ...info,
                data: {
                    ...info.data,
                    ...characters.data,
                },
            });
            const buffer = await puppeteer.screenShot(`http://127.0.0.1:8081/user-info`, i);
            return segment.image(buffer);
        } else {
            return `未找到cookie`;
        }
    }
}
