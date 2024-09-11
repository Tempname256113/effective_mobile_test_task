import {productsRepository} from "../repositories/products.repository.mjs";
import {productsQueryRepository} from "../repositories/products.query-repository.mjs";
import {httpErrors} from "@fastify/sensible";
import {rabbitmqQueues, rabbitmqService} from "../../../common/transport/rabbitmq.service.mjs";

export const productsService = {
    async createProduct(productName) {
        const createdProduct = await productsRepository.createProduct(productName);

        rabbitmqService.sendMessageToQueue(rabbitmqQueues.product_actions, {
            shop_id: null,
            product_id: createdProduct.id,
            action: 'create_product',
            data: null,
        });

        return createdProduct;
    },

    async createShop(shopName){
        return productsRepository.createShop(shopName)
    },

    async createStockToProduct(dto){
        const foundShopPromise = productsQueryRepository.getShopById(dto.shopId);
        const foundProductPromise = productsQueryRepository.getProductById(dto.productId);
        const foundProductStockPromise = productsQueryRepository.getProductStockByProductIdAndShopId({
            productId: dto.productId,
            shopId: dto.shopId,
        });

        const [
            foundShop,
            foundProduct,
            foundProductStock
        ] = await Promise.all([
            foundShopPromise,
            foundProductPromise,
            foundProductStockPromise
        ]);

        const shopAndProductIsExists = foundShop && foundProduct;

        if (!shopAndProductIsExists) {
            throw httpErrors.notFound('Product or shop is not found');
        }

        if (foundProductStock) {
            throw httpErrors.badRequest('Product stock is already exists')
        }

        const createdStockToProduct = await productsRepository.createStockToProduct(dto);

        rabbitmqService.sendMessageToQueue(rabbitmqQueues.product_actions, {
            shop_id: foundShop.id,
            product_id: foundProduct.id,
            action: 'create_stock_to_product',
            data: {
                stock_quantity: createdStockToProduct.stock_quantity,
                order_quantity: createdStockToProduct.order_quantity,
            },
        });

        return createdStockToProduct;
    },

    async _updateStockToProduct(dto, operation){
        const foundProductPromise = productsQueryRepository.getProductById(dto.productId);
        const foundProductStockPromise = productsQueryRepository.getProductStockByProductIdAndShopId({
            productId: dto.productId,
            shopId: dto.shopId,
        });

        const [foundProduct, foundProductStock] = await Promise.all([foundProductPromise, foundProductStockPromise]);

        const productAndProductStockIsExists = foundProduct && foundProductStock;

        if (!productAndProductStockIsExists) {
            throw httpErrors.notFound('Product or product stock is not found');
        }

        let updatedProductStock;
        let action;

        if (operation === '+') {
            action = 'increase_product_stock';
            updatedProductStock = await productsRepository.increaseStockToProduct.apply(productsRepository, [dto]);
        } else if (operation === '-') {
            action = 'decrease_product_stock';
            updatedProductStock = await productsRepository.decreaseStockToProduct.apply(productsRepository, [dto]);
        }

        rabbitmqService.sendMessageToQueue(rabbitmqQueues.product_actions, {
            shop_id: foundProductStock.shop_id,
            product_id: foundProduct.id,
            action,
            data: {
                previousStock: {
                    stock_quantity: foundProductStock.stock_quantity,
                    order_quantity: foundProductStock.order_quantity,
                },
                updatedStock: {
                    stock_quantity: updatedProductStock.stock_quantity,
                    order_quantity: updatedProductStock.order_quantity,
                },
            },
        });

        return updatedProductStock;
    },

    async increaseStockToProduct(dto){
        return this._updateStockToProduct(dto, '+');
    },

    async decreaseStockToProduct(dto){
        return this._updateStockToProduct(dto, '-');
    }
}