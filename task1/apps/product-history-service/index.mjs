import Fastify from "fastify";
import {productsHistoryController} from "./controllers/products-history.controller.mjs";

const fastify = Fastify({
    logger: true
});

fastify.register(productsHistoryController, { prefix: '/products/history' });

await fastify.listen({ port: 3002 });