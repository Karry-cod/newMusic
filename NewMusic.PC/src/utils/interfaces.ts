// 菜单
export interface IMenus {
    id: string,
    menus: Array<IMenus>,
    title: string,
    isChecked: boolean,
    path: string
}

// 用户信息
export interface IUser {
    uid: string,
    name: string,
    headImg: string,
    account: string,
    password: string,
    isLogin: boolean,
    ewm: string,
    cookie: string,
    code: string
}

// 音乐
export interface IMusic {
    mid: string,
    name: string,
    backImg: string,
    musicImg: string,
    author: string,
    mv: string,
    information: string,
    source: string,
    words: Array<string>,
    time: number,
    album?: string
}

// 歌单
export interface IMusicSheet {
    msid: string,
    musics: Array<IMusic>,
    listener: number,
    name: string,
    information: string,
    sheetImg: string,
    tags?: string[]
}

// Mv
export interface IMV {
    mvid: string,
    name: string,
    author: string,
    listener: number,
    backImg: string,
    publishTime: string,
    information: string,
    source: string,
    time?: number,
    playTime?: string,
    createrId?: string
}

// 接口请求参数
export interface IRequest {
    url: string,
    data?: any
}

// 接口响应参数
export interface IResponse {
    code: number,
    result?: any,
    data?: any
}