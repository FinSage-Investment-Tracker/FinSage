const cron = require("node-cron");
const { alertExecutor } = require("../controllers/alertExecutor");

// Cron job to check alerts every midnight (testing every 5 seconds: '*/5 * * * * *' '0 0 * * *'
cron.schedule('0 0 * * *', async () => { 
    alertExecutor();
});
