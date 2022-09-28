import { HardhatUserConfig } from 'hardhat/config';

import '@nomicfoundation/hardhat-toolbox';

import './src/plugin';

export default <HardhatUserConfig> {
  solidity: '0.8.9',
  typechain: {
    dontOverrideCompile: true,
  },
};
