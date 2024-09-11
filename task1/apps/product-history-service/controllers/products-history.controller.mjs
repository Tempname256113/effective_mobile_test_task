import {rabbitmqQueues, rabbitmqService} from "../../../common/transport/rabbitmq.service.mjs";
import {productsHistoryRepository} from "../repositories/products-history.repository.mjs";
import {productsHistoryQueryRepository} from "../repositories/products-history.query-repository.mjs";

export const productsHistoryController = async (fastify, opts) => {
    await rabbitmqService.receiveMessagesFromQueue(
        rabbitmqQueues.product_actions,
        productsHistoryRepository.saveProductHistoryAction
    );

    fastify.get('/', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    shop_id: { type: 'number' },
                    plu: { type: 'string' },
                    date_after: { type: 'string' },
                    date_before: { type: 'string' },
                    action: { type: 'string' },
                    page: { type: 'number' },
                    limit: { type: 'number' }
                },
            }
        }
    }, async (request, reply) => {
        return productsHistoryQueryRepository.getProductsHistory(request.query);
    });
}