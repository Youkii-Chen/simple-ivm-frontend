import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'
import { goodsInfoType, cateGoodsType } from '../types'
import { router } from '../route'

import Axios from 'axios'
import { notification } from 'ant-design-vue'



// 为 store state 声明类型
export interface State {
    isLogined: boolean
    debug: boolean
    goods: cateGoodsType[]
    tableDataSource: cateGoodsType[]
    access_token: string
    openDrawer: boolean
    currentItem: cateGoodsType
    loading: boolean
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
                loading: false,
                tableDataSource: [],
                access_token: (localStorage.getItem("access_token") as string),
                openDrawer: false,
                currentItem: {
                    key: '',
                    name: '',
                    mark: '',
                    unit: '',
                    goods: []
                },
            }
        })(),
        actions: {
            async login(context, data){
                const params = new URLSearchParams();
                params.append('username', data.username);
                params.append('password', data.password);
                Axios.post('/api/login', params, {headers: {'content-type': 'application/x-www-form-urlencoded'}})
                .then(response => {
                    // console.log(response)
                    if (response.status != 200){
                        // 用户名密码校验失败
                        if (response.status == 401){
                            notification.error({
                                duration: 3,
                                message: `登录失败: 用户名或密码错误.`
                            }) 
                        }else{
                            notification.error({
                                duration: 3,
                                message: `登录失败: ${ response.data.detail }`
                            })
                        }
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
                        // console.log(error)
                        notification.error({
                            duration: 3,
                            message: `登录失败: ${error.response.data.detail}`
                        })
                    }
                )
            },
            async logout(context){
                context.state.isLogined = false
                context.state.access_token = ""
                context.state.goods.length = 0
                context.state.tableDataSource.length = 0
                localStorage.removeItem("access_token")
                router.replace("/login") // reflesh
            },
            async get_goods(context){
                context.state.loading = true
                try {
                    const response = await axios.post('/list')
                    if (response.status == 200){
                        store.state.goods = response.data
                        store.state.tableDataSource = JSON.parse(JSON.stringify(response.data)) 
                    }
                } catch (error) {
                    notification.error({
                        duration: 3,
                        message: `无法获取货物列表: ${(error as any).response.data.detail}`
                    })
                }
                context.state.loading = false
            },
            async del(context, item){
                // 删除整个分类
                try {
                    const resp = await axios.post('/del', JSON.stringify(item))
                    if (resp.status == 200){
                        notification.info({message: "删除成功!"})
                        // await this.dispatch('get_goods')
                        
                        // 删除该项目
                        context.state.goods.forEach((item_,i)=> {
                            if (item_.key === item.key) {
                                context.state.goods.splice(i, 1);
                            }
                        })

                        context.state.tableDataSource.forEach((item_,i)=> {
                            if (item_.key === item.key) {
                                context.state.tableDataSource.splice(i, 1);
                            }
                        })
                    }else{
                        notification.error({duration: 3, message: `删除失败! : ${resp.data.detail}`})
                    }
                } catch (error) {
                    notification.error({
                        duration: 3,
                        message: `删除失败: ${(error as any).response.data.detail}`
                    })
                }
            },
            
            async update(context, [item, isNew = false]){
                try {
                    // console.debug(item)
                    const resp = await axios.post('/update', JSON.stringify(item))
                    // console.log(resp.data)
                    if (resp.status == 200){
                        notification.info({message: "更新成功!"})
                        item = resp.data
                        
                        if (isNew){
                            context.state.goods.push(item)
                            context.state.tableDataSource.push(JSON.parse(JSON.stringify(item)))
                        }else{
                            context.state.goods.forEach((item_,i)=> {
                                if (item_.key === item.key) {
                                    item_.name = item.name
                                    item_.mark = item.mark
                                    // item_.quan = item.quan
                                    item_.unit = item.unit
                                    // item_.goods = item.goods

                                    item_.goods.length = 0
                                    for (let subItem of item.goods){
                                        item_.goods.push(subItem)
                                    }
                                }
                            })
                            
                            item = JSON.parse(JSON.stringify(item))
                            context.state.tableDataSource.forEach((item_,i)=> {
                                if (item_.key === item.key) {
                                    item_.name = item.name
                                    item_.mark = item.mark
                                    // item_.quan = item.quan
                                    item_.unit = item.unit
                                    // item_.goods = item.goods
                                    item_.goods.length = 0
                                    for (let subItem of item.goods){
                                        item_.goods.push(subItem)
                                    }
                                }
                            })
                        }
                        
                        return JSON.parse(JSON.stringify(item))
                    }else{
                        notification.error({duration: 3, message: `更新失败! : ${resp.data.detail}`})
                    }
                    
                } catch (error) {
                    console.debug(error)
                    notification.error({
                        duration: 3,
                        message: `添加/更新 失败: ${(error as any).response.data.detail}`
                    })
                }
            },
        },
    }
)

export function useStore() {
    return baseUseStore(key)
}

export const axios = Axios.create({
    baseURL: '/api',
    headers: {
        'Accept': "application/json",
        'Authorization': '',
        'Content-Type': "application/json"
    }
})

axios.interceptors.request.use(function(config){
    if (store.state.access_token) (config.headers as any)['Authorization'] = store.state.access_token
    return config
})

axios.interceptors.response.use((response) => {
    // response.data = JSON.parse(response.data)
    // const data = response.data
    if (response.status != 200){
        console.log(JSON.stringify(response.data.detail))
    }if (response.status == 401){
        // token 失效
        store.state.access_token = ""
        store.state.isLogined = false
        localStorage.removeItem("access_token")
        router.replace('/login')
        // throw new Error("Token 失效")
    }
    return response
})