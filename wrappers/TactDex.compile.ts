import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/tact_dex.tact',
    options: {
        debug: true,
    },
};
