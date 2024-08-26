import { Blockchain, TreasuryContract, SandboxContract } from '@ton/sandbox';
import { toNano, Address } from '@ton/core';
import { TactDex } from '../wrappers/TactDex';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMaster } from '@ton/ton';

export async function run(provider: NetworkProvider) {

    const blockchain = await Blockchain.create();

    const adminAddress = Address.parse('0QCpS77uFvMxePZ9bhunRgf7-buBN7lqJtpm-MuFe5ZWlalC');
    const jettonAddressA = Address.parse('UQBxTD_kMVgPk9LC2RfGJLZsKxnECYrgagFpmUAekuz_qCby');
    const jettonAddressB = Address.parse('UQC8qikQUvjwR1skykkYn5oFvojPQyHwq-mNNNsZasRWqe6f');

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
    console.log('jettonA address', {jettonAddressA});
    console.log('jettonB address', {jettonAddressB});
    console.log(`Contract deployed at address: ${tactDex.address.toString()}`);
}
