import {db} from "../../../common/db/knex.config.mjs";

const extractFirstElemFromArr = (arr) => arr[0];

export const productsRepository = {
    async createProduct(productName){
        return db('products')
            .insert({
                name: productName
            })
            .returning('*')
            .then(extractFirstElemFromArr);
    },

    async createShop(shopName){
        return db('shops')
            .insert({
                name: shopName,
            })
            .returning('*')
            .then(extractFirstElemFromArr);
    },

    async createStockToProduct(dto){
        return db('stocks')
            .insert({
                product_id: dto.productId,
                shop_id: dto.shopId,
                stock_quantity: dto.stockQuantity,
                order_quantity: dto.orderQuantity
            })
            .returning('*')
            .then(extractFirstElemFromArr);
    },

    async _updateProductStockAmount(dto, operation){
        return db('stocks')
            .update({
                stock_quantity: db.raw(`stock_quantity ${operation} ?`, [dto.stockQuantity]),
                order_quantity: db.raw(`order_quantity ${operation} ?`, [dto.orderQuantity]),
                updated_at: new Date().toISOString()
            })
            .where({
                product_id: dto.productId,
                shop_id: dto.shopId,
            })
            .returning('*')
            .then(extractFirstElemFromArr);
    },

    async increaseStockToProduct(dto){
        return this._updateProductStockAmount(dto, '+');
    },

    async decreaseStockToProduct(dto){
        return this._updateProductStockAmount(dto, '-');
    }
}