import Fastify from "fastify";
import {productsController} from "./controllers/products.controller.mjs";
import fastifySensible from "@fastify/sensible";

const fastify = Fastify({
        logger: true
});

fastify.register(fastifySensible);
fastify.register(productsController, { prefix: '/products' });

await fastify.listen({ port: 3001 });