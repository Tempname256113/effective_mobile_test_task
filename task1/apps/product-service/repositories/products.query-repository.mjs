import {db} from "../../../common/pg.config.mjs";

export const productsQueryRepository = {
    async getShopById(shopId){
        return db('shops')
            .select('*')
            .where({
                id: shopId,
            })
            .first();
    },

    async getProductById(productId){
        return db('products')
            .select('*')
            .where({
                id: productId,
            })
            .first();
    },

    async getProducts(dto){
        let query = db('products').select('*');

        if (dto.name) {
            query = query.where('products.name', dto.name);
        }

        if (dto.plu) {
            query = query.where('products.plu', dto.plu);
        }

        return query;
    },

    async getProductStockByProductId(dto){
        return db('stocks')
            .select('*')
            .where({
                product_id: dto.productId,
                shop_id: dto.shopId,
            })
            .first();
    },

    async getProductStocks(dto){
        let query = db('stocks')
            .join('products', 'stocks.product_id', 'products.id')
            .select(
                'products.plu',
                'stocks.stock_quantity',
                'stocks.order_quantity',
                'stocks.shop_id'
            );

        if (dto.plu) {
            query = query.where('products.plu', dto.plu);
        }

        if (dto.shop_id) {
            query = query.where('stocks.shop_id', dto.shop_id);
        }

        // фильтр по количеству товара на полке (с-по)
        if (dto.stock_quantity_min) {
            query = query.where('stocks.stock_quantity', '>=', dto.stock_quantity_min);
        }
        if (dto.stock_quantity_max) {
            query = query.where('stocks.stock_quantity', '<=', dto.stock_quantity_max);
        }

        // фильтр по количеству товара в заказе (с-по)
        if (dto.order_quantity_min) {
            query = query.where('stocks.order_quantity', '>=', dto.order_quantity_min);
        }
        if (dto.order_quantity_max) {
            query = query.where('stocks.order_quantity', '<=', dto.order_quantity_max);
        }

        return query;
    }
}