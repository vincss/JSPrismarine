import { BlockIdsType } from '../BlockIdsType.js';
import Liquid from '../Liquid.js';

export default class FlowingLava extends Liquid {
    public constructor(name = 'minecraft:flowing_lava', id = BlockIdsType.FlowingLava) {
        super({
            name,
            id
        });
    }
}
