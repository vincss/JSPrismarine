import CommandExecuter from '../command/CommandExecuter';
import Human from '../entity/Human';
import ChatEvent from '../events/chat/ChatEvent';
import withDeprecated from '../hoc/withDeprecated';
import WindowManager from '../inventory/WindowManager';
import Connection from '../network/raknet/Connection';
import InetAddress from '../network/raknet/utils/InetAddress';
import Server from '../Server';
import Device from '../utils/Device';
import Skin from '../utils/skin/Skin';
import Chunk from '../world/chunk/Chunk';
import Gamemode from '../world/Gamemode';
import World from '../world/World';
import PlayerConnection from './PlayerConnection';

export enum PlayerPermission {
    Visitor,
    Member,
    Operator,
    Custom
}

export default class Player extends Human implements CommandExecuter {
    private readonly server: Server;
    private readonly address: InetAddress;
    private readonly playerConnection: PlayerConnection;

    // TODO: finish implementation
    private readonly windows: WindowManager;

    public username = {
        prefix: '<',
        suffix: '>',
        name: ''
    };

    public locale = '';
    public randomId = 0;

    public uuid = '';
    public xuid = '';
    public skin: Skin | null = null;

    public viewDistance: any;
    public gamemode = 0;

    public pitch = 0;
    public yaw = 0;
    public headYaw = 0;

    public onGround = false;
    public isSprinting = false;

    public platformChatId = '';

    public device: Device | null = null;

    public cacheSupport = false;

    public currentChunk: Chunk | null = null;

    /**
     * Player's constructor.
     */
    constructor(connection: Connection, world: World, server: Server) {
        super(world);
        this.address = connection.getAddress();
        this.server = server;
        this.playerConnection = new PlayerConnection(server, connection, this);
        this.windows = new WindowManager();

        // TODO: only set to default gamemode if there doesn't exist any save data for the user
        this.gamemode = Gamemode.getGamemodeId(
            server.getConfig().getGamemode()
        );

        // Handle chat messages
        server.getEventManager().on('chat', async (evt: ChatEvent) => {
            if (evt.cancelled) return;

            // TODO: proper channel system
            if (
                evt.getChat().getChannel() === '*.everyone' ??
                (evt.getChat().getChannel() === '*.ops' &&
                    this.server
                        .getPermissionManager()
                        .isOp(this.getUsername())) ??
                evt.getChat().getChannel() === `*.player.${this.getUsername()}`
            )
                await this.sendMessage(evt.getChat().getMessage());
        });
    }

    public async update(tick: number): Promise<void> {
        await this.playerConnection.update(tick);
    }

    public async kick(reason = 'unknown reason'): Promise<void> {
        this.getServer()
            .getLogger()
            .debug(`Player with id ${this.runtimeId} was kicked: ${reason}`);
        await this.playerConnection.kick(reason);
    }

    // Return all the players in the same chunk
    // TODO: move to world
    public getPlayersInChunk(): Player[] {
        return this.server
            .getOnlinePlayers()
            .filter((player) => player.currentChunk === this.currentChunk);
    }

    public async sendMessage(message: string): Promise<void> {
        await this.playerConnection.sendMessage(message);
    }

    public async setGamemode(mode: number): Promise<void> {
        this.gamemode = mode;
        await this.playerConnection.sendGamemode(this.gamemode);
    }

    public async setTime(tick: number): Promise<void> {
        await this.getConnection().sendTime(tick);
    }

    public getServer(): Server {
        return this.server;
    }

    public getConnection(): PlayerConnection {
        return this.playerConnection;
    }

    @withDeprecated(new Date('12/11/2020'), 'getConnection')
    public getPlayerConnection(): PlayerConnection {
        return this.getConnection();
    }

    public getAddress() {
        return this.address;
    }

    public getUsername(): string {
        return this.username.name;
    }

    public getFormattedUsername(): string {
        return `${this.username.prefix}${this.username.name}${this.username.suffix}`;
    }

    public getUUID(): string {
        return this.uuid ?? '';
    }

    public getWindows(): WindowManager {
        return this.windows;
    }

    public isPlayer(): boolean {
        return true;
    }

    public async setSprinting(val: boolean) {
        this.isSprinting = val;
        // TODO: notify clients
    }
    public async setOnGround(val: boolean) {
        this.onGround = val;
    }
}
