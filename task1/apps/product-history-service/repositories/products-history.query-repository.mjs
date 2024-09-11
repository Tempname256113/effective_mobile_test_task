import {db} from "../../../common/db/pg.config.mjs";

export const productsHistoryQueryRepository = {
    async getProductsHistory(dto){
        let query = db('product_actions_history as pah')
            .join('products as p', 'pah.product_id', 'p.id')
            .select('pah.*', 'p.plu');

        if (dto.shop_id) {
            query = query.where('pah.shop_id', dto.shop_id);
        }

        if (dto.plu) {
            query = query
                .where('p.plu', dto.plu);
        }

        if (dto.action) {
            query = query.where('pah.action', dto.action);
        }

        if (dto.date_after) {
            query = query.where('pah.action_date', '>=', dto.date_after); // без TO_TIMESTAMP
        }

        if (dto.date_before) {
            query = query.where('pah.action_date', '<=', dto.date_before); // без TO_TIMESTAMP
        }

        const limit = dto.limit ?? 50;
        const page = dto.page ?? 1;
        query = query.limit(limit).offset((page - 1) * limit);

        return query;
    },
}