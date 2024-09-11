import {productsService} from "../application/products.service.mjs";
import {productsQueryRepository} from "../repositories/products.query-repository.mjs";

export const productsController = async (fastify, opts) => {
    fastify.post('/', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    productName: { type: 'string' },
                },
                required: ['productName'],
            }
        }
    }, async (request, reply) => {
        return productsService.createProduct(request.body.productName);
    });

    fastify.get('/', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    plu: { type: 'string' },
                },
            }
        }
    }, async (request, reply) => {
        return productsQueryRepository.getProducts(request.query);
    });

    fastify.post('/shop', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    shopName: { type: 'string' },
                },
                required: ['shopName'],
            }
        }
    }, async (request, reply) => {
        return productsService.createShop(request.body.shopName);
    });

    const productStockBaseSchema = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    productId: { type: 'number' },
                    shopId: { type: 'number' },
                    stockQuantity: { type: 'number' },
                    orderQuantity: { type: 'number' },
                },
                required: ['productId', 'stockQuantity', 'orderQuantity', 'shopId'],
            }
        }
    }

    fastify.post('/stock', productStockBaseSchema, async (request, reply) => {
        return productsService.createStockToProduct(request.body);
    });

    fastify.get('/stock', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    plu: { type: 'string' },
                    shop_id: { type: 'number' },
                    stock_quantity_min: { type: 'number' },
                    stock_quantity_max: { type: 'number' },
                    order_quantity_min: { type: 'number' },
                    order_quantity_max: { type: 'number' },
                },
            }
        }
    }, (request, reply) => {
        return productsQueryRepository.getProductStocks(request.query);
    });

    fastify.patch('/stock/increase', productStockBaseSchema, (request, reply) => {
        return productsService.increaseStockToProduct.apply(productsService, [request.body]);
    });

    fastify.patch('/stock/decrease', productStockBaseSchema, (request, reply) => {
        return productsService.decreaseStockToProduct.apply(productsService, [request.body]);
    });
}