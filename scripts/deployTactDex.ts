import { Blockchain, TreasuryContract, SandboxContract } from '@ton/sandbox';
import { toNano, Address } from '@ton/core';
import { TactDex } from '../wrappers/TactDex';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const blockchain = await Blockchain.create();

    let adminAddress: Address;
    let jettonAddressA: Address;
    let jettonAddressB: Address;

    adminAddress = Address.parse('0QCpS77uFvMxePZ9bhunRgf7-buBN7lqJtpm-MuFe5ZWlalC');
    jettonAddressA = Address.parse('UQBxTD_kMVgPk9LC2RfGJLZsKxnECYrgagFpmUAekuz_qCby');
    jettonAddressB = Address.parse('UQC8qikQUvjwR1skykkYn5oFvojPQyHwq-mNNNsZasRWqe6f');

    const tactDex = provider.open(await TactDex.fromInit(adminAddress, jettonAddressA, jettonAddressB));

    await tactDex.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tactDex.address);

    // run methods on `tactDex`
    console.log(`Contract deployed at address: ${tactDex.address}`);
}
