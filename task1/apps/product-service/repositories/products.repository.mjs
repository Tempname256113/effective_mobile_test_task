import {db} from "../../../common/pg.config.mjs";

export const productsRepository = {
    async createProduct(productName){
        return db('products')
            .insert({
                name: productName
            })
            .returning('*');
    },

    async createShop(shopName){
        return db('shops')
            .insert({
                name: shopName,
            })
            .returning('*');
    },

    async createStockToProduct(dto){
        return db('stocks')
            .insert({
                product_id: dto.productId,
                shop_id: dto.shopId,
                stock_quantity: dto.stockQuantity,
                order_quantity: dto.orderQuantity
            })
            .returning('*');
    },

    async _updateProductsStockAmount(dto, operation){
        return db('stocks')
            .update({
                stock_quantity: db.raw(`stock_quantity ${operation} ?`, [dto.stockQuantity]),
                order_quantity: db.raw(`order_quantity ${operation} ?`, [dto.orderQuantity]),
                updated_at: new Date().toISOString()
            })
            .where({
                product_id: dto.productId
            })
            .returning('*');
    },

    async increaseStockToProduct(dto){
        return this._updateProductsStockAmount(dto, '+');
    },

    async decreaseStockToProduct(dto){
        return this._updateProductsStockAmount(dto, '-');
    }
}