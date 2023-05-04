require("../src/index")

const { webhookCallback } = require("grammy")
const bot = require("../src/core/bot")

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        });
    });
}

async function handler(req, res) {
    // Run the middleware
    await runMiddleware(req, res, webhookCallback(bot));
}

module.exports = handler
