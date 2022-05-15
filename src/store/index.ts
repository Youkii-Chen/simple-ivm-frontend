import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'
import { goodsInfoType } from '../types'

// 为 store state 声明类型
export interface State {
  isLogined: boolean
  debug: boolean
  goods: goodsInfoType[]
  tableDataSource: goodsInfoType[]
  units: Array<string>
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol()

const fakeGoods: goodsInfoType[] = [
    {
        key: 0,
        name: "苹果",
        quan:  100,
        unit: "千克"
    },{
        key: 1,
        name: "凤梨",
        quan:  200,
        unit: "个"
    },{
        key: 2,
        name: "香蕉",
        quan:  300,
        unit: "箱"
    },{
        key: 3,
        name: "西瓜",
        quan:  125,
        unit: "个",
        mark: "快过期了"
    },
    {
        key: 4,
        name: "水蜜桃",
        quan:  60,
        unit: "千克",
        mark: "快点卖掉"
    },
    {
        key: 5,
        name: "哈密瓜",
        quan:  88,
        unit: "个",
        mark: "不能久放"
    },
]

export const store = createStore<State>(
    {
        state(){
            return{
                isLogined: false,
                debug: true,
                goods: fakeGoods,
                tableDataSource: [...fakeGoods],
                units: ['箱', '个', '千克', '吨', '斤']

            }
        },
        actions:{
            login(context){
                // @TODO 做登录校验
                context.commit('login')
            }
        }
        ,
        mutations: {
            login(state){
                
                state.isLogined = true
            }
        }
    }
)

export function useStore () {
    return baseUseStore(key)
  }