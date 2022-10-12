import 'reflect-metadata';
import { Page, ElementHandle, Browser, launch, LaunchOptions, Viewport, ScreenshotClip, Keyboard } from 'puppeteer';
import { Service } from 'typedi';

/**
 * PuppeteerBrowser
 */
@Service()
export class PuppeteerService {
    constructor(readonly opt: LaunchOptions = {}) {}
    /**browser */
    browser!: Browser;
    /**
     * init
     */
    async init(): Promise<void> {
        this.browser = await launch({
            headless: true,
            // slowMo: 50, //放慢速度
        });
    }

    /**
     * destroy
     */
    async destroy(): Promise<void> {
        await this.browser.close();
    }

    async screenShot(url: string, info: string): Promise<Buffer> {
        if (this.browser == null) await this.init();
        const page = await this.browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
        });
        await page.goto(url);
        await page.evaluate(() => ((document.querySelector('#input  textarea') as any).value = ''));
        // console.log('eva');
        const input = await page.$('#input textarea');
        // console.log('type');
        await input.focus();
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await page.keyboard.sendCharacter(info);
        // console.log('typed');
        const output = await page.$('#output');
        await output.focus();
        await output.click();
        await page.waitForSelector(`#finish`);
        // console.log('output');
        const pic = await output.screenshot({});
        // console.log('end');
        await page.close();
        return pic as Buffer;
    }

    /**
     * once
     */
    once(res: { (value: unknown): void; (arg0: unknown): void }): void {
        this.browser.once('targetcreated', (target: { page: () => unknown }) => res(target.page()));
    }
}
