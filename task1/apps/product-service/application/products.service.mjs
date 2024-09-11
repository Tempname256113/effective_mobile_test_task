import {productsRepository} from "../repositories/products.repository.mjs";
import {productsQueryRepository} from "../repositories/products.query-repository.mjs";
import {httpErrors} from "@fastify/sensible";

export const productsService = {
    async createProduct(productName) {
        return productsRepository.createProduct(productName)
    },

    async createShop(shopName){
        return productsRepository.createShop(shopName)
    },

    async createStockToProduct(dto){
        const foundShopPromise = productsQueryRepository.getShopById(dto.shopId);
        const foundProductPromise = productsQueryRepository.getProductById(dto.productId);
        const foundProductStockPromise = productsQueryRepository.getProductStockByProductId({
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

        return productsRepository.createStockToProduct(dto);
    },

    async increaseStockToProduct(dto){
        const foundProduct = await productsQueryRepository.getProductById(dto.productId);

        if (!foundProduct) {
            throw httpErrors.notFound('Product is not found');
        }

        return productsRepository.increaseStockToProduct.apply(productsRepository, [dto]);
    },

    async decreaseStockToProduct(dto){
        const foundProduct = await productsQueryRepository.getProductById(dto.productId);

        if (!foundProduct) {
            throw httpErrors.notFound('Product is not found');
        }

        return productsRepository.decreaseStockToProduct.apply(productsRepository, [dto]);
    }
}