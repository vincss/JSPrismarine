import ConfigBuilder from './ConfigBuilder';
import Gamemode from '../world/Gamemode';
import { SeedGenerator } from '../utils/Seed';
import cwd from '../utils/cwd';
import path from 'path';

export default class Config {
    private configBuilder!: ConfigBuilder;

    private version!: string;
    private port!: number;
    private serverIp!: string;
    private levelName!: string;
    private worlds!: any;
    private maxPlayers!: number;
    private gamemode!: string;
    private motd!: string;
    private viewDistance!: number;
    private onlineMode!: boolean;
    private enableEval!: boolean;
    private enableTelemetry!: boolean;
    private telemetryUrls!: string[];
    private packetCompressionLevel!: number;
    private updateRepo!: string;
    private updateChannel!: string;
    private experimentalFlags!: string[];

    public constructor(version: string) {
        this.version = version;
        this.onEnable();
    }

    public onEnable() {
        this.configBuilder = new ConfigBuilder(path.join(cwd(), 'config.yaml'));
        (global as any).log_level = this.configBuilder.get('log-level', 'info');

        this.port = this.configBuilder.get('port', 19132);
        this.serverIp = this.configBuilder.get('server-ip', '0.0.0.0');
        this.levelName = this.configBuilder.get('level-name', 'world');
        this.worlds = this.configBuilder.get('worlds', {
            world: {
                generator: 'overworld',
                provider: 'Filesystem',
                seed: SeedGenerator()
            }
        });
        this.maxPlayers = this.configBuilder.get('max-players', 20);
        this.gamemode = this.configBuilder.get('gamemode', 'survival');
        this.motd = this.configBuilder.get('motd', 'Another JSPrismarine server!');
        this.viewDistance = this.configBuilder.get('view-distance', 10);
        this.onlineMode = this.configBuilder.get('online-mode', true);
        this.enableEval = this.configBuilder.get('enable-eval', false);
        this.enableTelemetry = this.configBuilder.get('enable-telemetry', true);
        this.telemetryUrls = this.configBuilder.get('telemetry-urls', ['https://telemetry.prismarine.dev']);
        this.packetCompressionLevel = this.configBuilder.get('packet-compression-level', 7);
        this.experimentalFlags = this.configBuilder.get('experimental-flags', []);

        this.updateRepo = this.configBuilder.get('update-repo', 'JSPrismarine/JSPrismarine');
        this.updateChannel = this.configBuilder.get('update-channel', 'release');
    }

    public onDisable() {}

    public getVersion() {
        return this.version;
    }

    public getPort(): number {
        return this.port;
    }

    public getServerIp(): string {
        return this.serverIp;
    }

    /**
     * Returns the default world's name (`id`).
     *
     * @remarks
     * If the world doesn't exist as a part of the `worlds` array the `worldManager` will
     * fail to initialize.
     *
     * @returns The world's name as a `string`
     */
    public getLevelName(): string {
        return this.levelName;
    }

    public getWorlds(): any {
        return this.worlds;
    }

    /**
     *
     * @returns The max amount of players allowed onto the server at the same time.
     */
    public getMaxPlayers() {
        return this.maxPlayers;
    }

    public getGamemode() {
        return this.gamemode;
    }

    /**
     * Set the default gamemode.
     *
     * @param gamemode the gamemode
     * @param write if the value should be written to the `config.yml` file
     */
    public setGamemode(gamemode: number, write = false) {
        this.gamemode = Gamemode.getGamemodeName(gamemode).toLowerCase();

        if (write) this.configBuilder.set('gamemode', this.gamemode);
    }

    /**
     * Returns true or false depending on if online mode is enabled.
     *
     * @returns The message of the day as a `string`
     */
    public getMotd(): string {
        return this.motd;
    }

    /**
     * Set the motd.
     *
     * @param motd the gamemode
     * @param write if the value should be written to the `config.yml` file
     */
    public setMotd(motd: string, write = false) {
        this.motd = motd;

        if (write) this.configBuilder.set('motd', this.motd);
    }

    /**
     * Returns the view distance.
     *
     * @returns The view distance as an `integer`
     */
    public getViewDistance(): number {
        return Math.round(this.viewDistance); // Make sure it's always an integer
    }

    /**
     * Returns true or false depending on if online mode is enabled.
     *
     * @returns `true` if enabled, `false` otherwise
     */
    public getOnlineMode(): boolean {
        return this.onlineMode;
    }

    /**
     * Returns true or false depending on if the `/eval` is enabled.
     *
     * @returns `true` if enabled, `false` otherwise
     */
    public getEnableEval(): boolean {
        return this.enableEval;
    }

    /**
     * If telemetry is enabled and which urls/backends to send data to.
     *
     * @returns An `object` containing the status of telemetry and the urls which should be reported to.
     */
    public getTelemetry() {
        return {
            enabled: this.enableTelemetry,
            urls: this.telemetryUrls
        };
    }

    public getPacketCompressionLevel() {
        return this.packetCompressionLevel;
    }

    public getUpdateRepo() {
        return this.updateRepo;
    }

    public getUpdateChannel() {
        return this.updateChannel;
    }

    public getExperimentalFlags() {
        return this.experimentalFlags;
    }
}
