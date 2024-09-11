import {db} from "../../../common/db/pg.config.mjs";

export const productsHistoryRepository = {
    async saveProductHistoryAction(dto){
        await db('product_actions_history').insert({
            shop_id: dto.shop_id,
            product_id: dto.product_id,
            action: dto.action,
            data: dto.data,
        });
    }
}