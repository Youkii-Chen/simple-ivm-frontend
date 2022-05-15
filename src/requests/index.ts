import { goodsInfoType, userInfo } from "../types";
import { Axios } from 'axios'
const axios = new Axios()


/**
 * 发起登录请求
 * @param  {userInfo} data
 */
export function login(data: userInfo)  {
    
}

/**
 * 退出登录
 */
export function logout(){

}

export class goods{
    static get_all(): goodsInfoType[]{
        return []
    }

    // static get(gkey: number): goodsInfoType{
    //     return {}
    // }

    static update(): boolean{
        return true
    }
    /**
     * 添加货物
     * @param  {goodsInfoType} goods 货物项目
     */
    static add(goods: goodsInfoType){

    }

    static del(goods: goodsInfoType){

    }

}
