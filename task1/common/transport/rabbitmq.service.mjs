import amqp from "amqplib";

const RABBITMQ_URL = process.env.RMQ_URL || 'amqp://localhost';

export const rabbitmqService = {
    async sendMessageToQueue(queue, message){
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();

            await channel.assertQueue(queue);
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

            setTimeout(() => {
                connection.close();
            }, 500);
        } catch (error) {
            console.error('Error sending message to RabbitMQ:', error);
        }
    },

    async receiveMessagesFromQueue(queue, callback){
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();

            await channel.assertQueue(queue);

            await channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    const messageContent = JSON.parse(msg.content.toString());

                    await callback(messageContent);

                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('Error receiving messages from RabbitMQ:', error);
        }
    }
}

export const rabbitmqQueues = {
    product_actions: 'product_actions'
}