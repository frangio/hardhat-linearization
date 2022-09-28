import { task } from 'hardhat/config';
import { parseFullyQualifiedName } from 'hardhat/utils/contract-names';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { astDereferencer, findAll } from 'solidity-ast/utils';

task("print-linearization")
  .addPositionalParam("contract", "The fully qualified contract name (contracts/File.sol:ContractName)")
  .addFlag("noCompile", "Skip compilation")
  .setAction(async (args: { contract: string, noCompile: boolean }, hre, runSuper) => {
    if (!args.noCompile) {
      await hre.run(TASK_COMPILE, { quiet: true });
    }
    const buildInfo = await hre.artifacts.getBuildInfo(args.contract);
    if (buildInfo === undefined) {
      throw new Error('Build info not found');
    }
    const { sourceName, contractName } = parseFullyQualifiedName(args.contract);
    const deref = astDereferencer(buildInfo.output);
    for (const c of findAll('ContractDefinition', buildInfo.output.sources[sourceName]!.ast)) {
      if (c.name === contractName) {
        const list = c.linearizedBaseContracts.map(id => deref('ContractDefinition', id).name);
        console.log(list.join('\n'));
        break;
      }
    }
  });
