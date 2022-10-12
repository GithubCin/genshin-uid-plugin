import { Cookie } from 'src/typeorm/entities/cookies.entity';
import { createHash } from 'crypto';
import fetch from 'node-fetch';

const mhyVersion = '2.11.1';
const HEADER = {
    'x-rpc-app_version': mhyVersion,
    'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.11.1',
    'x-rpc-client_type': '5',
    Referer: 'https://webstatic.mihoyo.com/',
    Origin: 'https://webstatic.mihoyo.com',
};
const NEW_URL = 'https://api-takumi-record.mihoyo.com';

//获取角色基本信息
const PLAYER_INFO_URL = NEW_URL + '/game_record/app/genshin/api/index';
const PLAYER_DETAIL_INFO_URL = NEW_URL + '/game_record/app/genshin/api/character';
const server_id = 'cn_gf01';

export interface Avatars {
    id: number;
    icon: string;
    image: string;
    name: string;
    element: string;
    fetter: number;
    level: number;
    rarity: number;
    actived_constellation_num: 0;
    card_image: string;
    is_chosen: false;
    weapon: {
        id: number;
        name: string;
        icon: string;
        type: number;
        rarity: number;
        level: number;
        promote_level: number;
        type_name: string;
        desc: string;
        affix_level: number;
    };
    reliquaries: unknown[];
}

export interface UserInfoResponse {
    retcode: number;
    message: 'OK';
    data: {
        role: {
            AvatarUrl: string;
            nickname: string;
            region: string;
            level: number;
        };
        avatars: {
            id: number;
            icon: string;
            image: string;
            name: string;
            element: string;
            fetter: number;
            level: number;
            rarity: number;
            actived_constellation_num: 0;
            card_image: string;
            is_chosen: false;
        }[];
    };
}
export interface charactersResponse {
    retcode: number;
    message: 'OK';
    data: {
        avatars: Avatars[];
        role: {
            AvatarUrl: string;
            nickname: string;
            region: string;
            level: number;
        };
    };
}

const getDSToken = (q = '', b = null, salt = null): string => {
    const br = b != null ? JSON.stringify(b) : '';
    const s = salt ?? 'xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs';
    const t = Math.round(new Date().valueOf() / 1000);
    const r = Math.floor(Math.random() * (200000 - 100000 + 1) + 100000);
    const c = createHash('md5').update(`salt=${s}&t=${t}&r=${r}&b=${br}&q=${q}`).digest('hex');
    return `${t},${r},${c}`;
};

export const getUserInfo = async (cookie: Cookie): Promise<UserInfoResponse> => {
    const headers = { ...HEADER, Cookie: cookie.cookies, DS: getDSToken(`role_id=${cookie.uid}&server=${server_id}`) };
    const u = new URL(PLAYER_INFO_URL);
    u.searchParams.append('server', server_id);
    u.searchParams.append('role_id', String(cookie.uid));
    const response = await fetch(u.href, {
        method: 'GET',
        headers,
    });
    const data = await response.json();
    return data;
};

export const getCharacters = async (cookie: Cookie, characters: number[]): Promise<charactersResponse> => {
    const payload = { character_ids: characters, role_id: cookie.uid, server: server_id };
    const headers = {
        ...HEADER,
        Cookie: cookie.cookies,
        DS: getDSToken(``, payload),
    };
    const response = await fetch(PLAYER_DETAIL_INFO_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
};
