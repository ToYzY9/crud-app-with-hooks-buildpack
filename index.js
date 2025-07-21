const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger"); // Importation du logger

// Démarrer le serveur
app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
