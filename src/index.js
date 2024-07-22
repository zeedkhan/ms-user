const { createServer } = require("../src/utils/server");

const app = createServer();

app.listen(8002, () => {
    // startUpDB();
    console.log("Running", 8002)
});

export default app;