import RedSandstone, { RedSandstoneType } from './RedSandstone.js';

export default class RedChiseledSandstone extends RedSandstone {
    public constructor() {
        super('minecraft:chiseled_red_sandstone', RedSandstoneType.Chiseled);
    }
}
