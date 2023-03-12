import { Config, Logger, Server } from '@vincss/prismarine';

import Updater from '@vincss/updater';
import exitHook from 'async-exit-hook';
import fs from 'node:fs';
import path from 'node:path';

// Process metadata
process.title = 'Prismarine';

if (process.env.JSP_DIR && !fs.existsSync(path.join(process.cwd(), process.env.JSP_DIR)))
    fs.mkdirSync(path.join(process.cwd(), process.env.JSP_DIR));

const version = process.env.npm_package_version!;

const config = new Config(version);
config.setMotd(' - dev - ');

const logger = new Logger();
const updater = new Updater({
    config,
    logger,
    version
});

const connectionCallBack = async () => {
    await server.shutdown({ withoutSaving: true });
};

const server = new Server({
    config,
    logger,
    version,
    connectionCallBack
});
const applied = server.getConfig();
logger.info('aplied', JSON.stringify(applied))

exitHook(async () => {
    await server.shutdown();
});

await updater.check();

try {
    await server.bootstrap(config.getServerIp(), config.getServerPort());
} catch (e) {
    logger.error(`Cannot start the server, is it already running on the same port? (${<Error>e})`, 'Prismarine');
    await server.shutdown({ crash: true });
    process.exit(1);
}
