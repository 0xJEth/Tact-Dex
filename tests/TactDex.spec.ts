import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { TactDex } from '../wrappers/TactDex';
import '@ton/test-utils';

describe('TactDex', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tactDex: SandboxContract<TactDex>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tactDex = blockchain.openContract(await TactDex.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await tactDex.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tactDex.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tactDex are ready to use
    });
});

