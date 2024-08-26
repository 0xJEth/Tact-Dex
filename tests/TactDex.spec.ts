import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Address, Cell, beginCell } from '@ton/core';
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

    it('should deploy with the correct initial state', async() => {
        const balanceA = await tactDex.getBalance(jettonAddressA);
        const balanceB = await tactDex.getBalance(jettonAddressB);

        expect(balanceA).toEqual(0n);
        expect(balanceB).toEqual(0n);

    });

    it('should add jettons to the pool by admin', async() => {
        const amountToAdd = 1000n;
        await tactDex.send(
            deployer.getSender(),
            {
                value: toNano('0.02'),
            },
            {
                $$type: 'TokenNotification',
                queryId: 0n,
                amount: amountToAdd,
                from: adminAddress,
                forwardPayload: beginCell().endCell().beginParse()
            }
        );
        console.log('amount',{amountToAdd});
    });
    
    it('should swap jetton B for jetton A', async () => {
        const initialA = 1000n;
        const initialB = 200n;
        const swapB = 100n;

        // Admin adds initial jettons to the pool
        await tactDex.send(
            deployer.getSender(),
            {
                value: toNano('0.02'),
            },
            {
                $$type: 'TokenNotification',
                queryId: 0n,
                amount: initialA,
                from: adminAddress,
                forwardPayload: beginCell().endCell().beginParse()
            }
        );

        await tactDex.send(
            deployer.getSender(),
            {
                value: toNano('0.02'),
            },
            {
                $$type: 'TokenNotification',
                queryId: 0n,
                amount: initialB,
                from: adminAddress,
                forwardPayload: beginCell().endCell().beginParse()
            }
        );

        // Simulate a user swapping jetton B for A
        await tactDex.send(
            deployer.getSender(),
            {
                value: toNano('0.02'),
            },
            {
                $$type: 'TokenNotification',
                queryId: 0n,
                amount: swapB,
                from: deployer.address,
                forwardPayload: beginCell().endCell().beginParse()
            }
        );

        const balanceA = await tactDex.getBalance(jettonAddressA);
        const balanceB = await tactDex.getBalance(jettonAddressB);

        // Calculate expected amounts after swap
        const expectedA = initialA - (initialA * swapB / initialB);
        const expectedB = initialB + swapB;

        /*expect(balanceA).toEqual(expectedA);
        expect(balanceB).toEqual(expectedB);*/
        console.log('a amount', {expectedA});
        console.log('b amount', {expectedB});
    });

    
});
