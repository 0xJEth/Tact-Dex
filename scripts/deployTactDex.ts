import { toNano } from '@ton/core';
import { TactDex } from '../wrappers/TactDex';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tactDex = provider.open(await TactDex.fromInit());

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
}
