import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'
import { goodsInfoType } from '../types'
import { router } from '../route'

import { Axios } from 'axios'
import { notification } from 'ant-design-vue'



// 为 store state 声明类型
export interface State {
    isLogined: boolean
    debug: boolean
    goods: goodsInfoType[]
    tableDataSource: goodsInfoType[]
    remote_url: string
    access_token: string
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol()
{
// const fakeGoods: goodsInfoType[] = [
//     {
//         key: 0,
//         name: "苹果",
//         quan: 100,
//         unit: "千克"
//     }, {
//         key: 1,
//         name: "凤梨",
//         quan: 200,
//         unit: "个"
//     }, {
//         key: 2,
//         name: "香蕉",
//         quan: 300,
//         unit: "箱"
//     }, {
//         key: 3,
//         name: "西瓜",
//         quan: 125,
//         unit: "个",
//         mark: "快过期了"
//     },
//     {
//         key: 4,
//         name: "水蜜桃",
//         quan: 60,
//         unit: "千克",
//         mark: "快点卖掉"
//     },
//     {
//         key: 5,
//         name: "哈密瓜",
//         quan: 88,
//         unit: "个",
//         mark: "不能久放"
//     },
// ]
}

export const store = createStore<State>(
    {
        state: (function(){
            return {
                isLogined: (localStorage.getItem("access_token") as string) ? true : false,
                debug: false,
                goods: [],
                tableDataSource: [],
                remote_url: "http://127.0.0.1:8000",
                access_token: (localStorage.getItem("access_token") as string)
            }
        })(),
        actions: {
            login(context, data){
                const params = new URLSearchParams();
                params.append('username', data.username);
                params.append('password', data.password);
                axios.post('/login/', params, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                .then(response => {
                    console.log(response)
                    if (response.status != 200){
                        // 用户名密码校验失败
                        
                        notification.error({
                            message: `登录失败: ${ response.data.detail }`
                        })
                    }else {
                        // 成功登录
                        localStorage.setItem("access_token", `Bearer ${ response.data.access_token }`)
                        context.state.access_token = `Bearer ${ response.data.access_token }`
                        context.state.isLogined = true
                        notification.success({
                            message: `登录成功!`
                        })
                        router.replace("/goods")
                    }
                }).catch(
                    error => {
                        notification.error({
                            message: `登录失败: 服务器错误! ${error}`
                        })
                    }
                )
            },
            logout(context){
                context.state.isLogined = false
                context.state.access_token = ""
                localStorage.removeItem("access_token")
                router.replace("/login") // reflesh
            },
            async get_goods(context){
                // goods.get_all()
                try {
                    const response = await axios.post('/list')
                    if (response.status == 200){
                        context.state.goods = response.data
                        context.state.tableDataSource.length = 0
                        for (let item of context.state.goods){
                            context.state.tableDataSource.push(item)
                        }
                    }
                } catch (error) {
                    notification.error({
                        message: `无法获取货物列表: ${error}`
                    })
                }
            },
            async del(context, item){
                try {
                    await axios.post('/del', item)
                    context.state.goods.forEach((item_, idx, arr)=>{
                        if (item_.name == item.name){
                            arr.splice(idx, 1);
                        }
                    })
                    notification.info({message: "删除成功"})
                } catch (error) {
                    notification.error({
                        message: `删除失败: ${error}`
                    })
                }
            },
            async add(context, item){
                try {
                    await axios.post('/add', item)
                    notification.info({message: "添加成功"})
                    await this.dispatch('get_goods')
                } catch (error) {
                    notification.error({
                        message: `添加失败: ${error}`
                    })
                }
            }
        },
    }
)

export function useStore() {
    return baseUseStore(key)
}

const axios = new Axios({
    baseURL: store.state.remote_url,
    headers: {
        accept: "application/json",
        Authorization: ''
    }
})

axios.interceptors.request.use(function(config){
    if (store.state.access_token) (config.headers as any).Authorization = store.state.access_token
    return config
})

axios.interceptors.response.use(function(response){
    if (response.status == 401){
        // token 失效
        store.state.access_token = ""
        store.state.isLogined = false
        localStorage.removeItem("access_token")
        notification.error({
            message: "登录失效, 请重新登录！"
        })
        throw new Error("Token 失效")
    }
    response.data = JSON.parse(response.data)
    return response
})