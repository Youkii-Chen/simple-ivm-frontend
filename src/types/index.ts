type goodsInfoType = {
    key: string,
    name: string,
    quan: number,
    flag: string,
    base?: number,
}

type cateGoodsType = {
    key: string,
    name: string,
    unit: string,
    mark: string,
    goods: goodsInfoType[],
}

interface userInfo{
    username: string,
    password: string
}
// interface currnetItemType extends goodsInfoType {
//     newQuan: number
// }
export type { goodsInfoType, userInfo, cateGoodsType }