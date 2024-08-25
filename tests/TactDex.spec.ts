import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Address } from '@ton/core';
import { TactDex } from '../wrappers/TactDex';
import '@ton/test-utils';

describe('TactDex', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tactDex: SandboxContract<TactDex>;
    let adminAddress: Address;
    let jettonAddressA: Address;
    let jettonAddressB: Address;


    beforeEach(async () => {
        blockchain = await Blockchain.create();

        adminAddress = Address.parse('0QCpS77uFvMxePZ9bhunRgf7-buBN7lqJtpm-MuFe5ZWlalC');
        jettonAddressA = Address.parse('UQBxTD_kMVgPk9LC2RfGJLZsKxnECYrgagFpmUAekuz_qCby');
        jettonAddressB = Address.parse('UQC8qikQUvjwR1skykkYn5oFvojPQyHwq-mNNNsZasRWqe6f');

        tactDex = blockchain.openContract(await TactDex.fromInit(adminAddress, jettonAddressA, jettonAddressB));

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
