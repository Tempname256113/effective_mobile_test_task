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
        body: {
            type: 'object',
            properties: {
                productId: { type: 'number' },
                stockQuantity: { type: 'number' },
                orderQuantity: { type: 'number' },
            },
            required: ['productId', 'stockQuantity', 'orderQuantity'],
        }
    }

    fastify.post('/stock', {
        schema: {
            body: {
                ...productStockBaseSchema.body,
                properties: {
                    ...productStockBaseSchema.body.properties,
                    shopId: { type: 'number' }
                },
                required: [
                    ...productStockBaseSchema.body.required,
                    'shopId'
                ],
            }
        }
    }, async (request, reply) => {
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

    fastify.patch('/stock/increase', {
        schema: productStockBaseSchema
    }, (request, reply) => {
        return productsService.increaseStockToProduct(request.body);
    });

    fastify.patch('/stock/decrease', {
        schema: productStockBaseSchema
    }, (request, reply) => {
        return productsService.decreaseStockToProduct(request.body);
    });
}