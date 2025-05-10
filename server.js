import app from "./app.js";
import config from "./config/default.js";

const PORT = config.app.port;

app.listen(PORT, () => {
  console.log(`Server running in ${config.app.nodeEnv} mode on port ${PORT}`);
});
