import type { AbiEvent } from 'abitype'
import { expect, test } from 'vitest'

import {
  wagmiContractConfig,
  publicClient,
  walletClient,
  accounts,
} from '../_test'
import { getContract, getEventArgsAndParams } from './getContract'

const contract = getContract({
  ...wagmiContractConfig,
  publicClient,
  walletClient,
})

test('createEventFilter', async () => {
  await expect(
    contract.createEventFilter.Transfer({
      from: accounts[0].address,
    }),
  ).resolves.toBeDefined()

  await expect(
    contract.createEventFilter.Transfer(
      {
        from: accounts[0].address,
      },
      {
        fromBlock: 10_000n,
      },
    ),
  ).resolves.toBeDefined()

  const contractNoIndexedEventArgs = getContract({
    ...wagmiContractConfig,
    abi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            type: 'address',
          },
          { indexed: false, type: 'address' },
          {
            indexed: true,
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ],
    publicClient,
  })
  await expect(
    contractNoIndexedEventArgs.createEventFilter.Transfer([
      accounts[0].address,
    ]),
  ).resolves.toBeDefined()
})

test('estimateGas', async () => {
  await expect(
    contract.estimateGas.mint({
      account: accounts[0].address,
    }),
  ).resolves.toBeDefined()
})

test('read', async () => {
  await expect(
    contract.read.balanceOf([accounts[0].address]),
  ).resolves.toBeDefined()
})

test('simulate', async () => {
  const contract = getContract({
    ...wagmiContractConfig,
    abi: wagmiContractConfig.abi.filter(
      (x) => (x as { name: string }).name === 'mint',
    ),
    publicClient,
    walletClient,
  })
  await expect(
    contract.simulate.mint({
      account: accounts[0].address,
    }),
  ).resolves.toMatchInlineSnapshot(`
    {
      "request": {
        "abi": [
          {
            "inputs": [],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256",
              },
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
        ],
        "account": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "address": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
        "args": [],
        "functionName": "mint",
      },
      "result": undefined,
    }
  `)
})

test('watchEvent', async () => {
  const unwatch = contract.watchEvent.Transfer({
    onLogs: () => {},
  })
  unwatch()
})

test('write', async () => {
  await expect(
    contract.write.mint({
      account: accounts[0].address,
    }),
  ).resolves.toBeDefined()
})

test('js reserved keywords/prototype methods as abi item names', async () => {
  const contractNoIndexedEventArgs = getContract({
    ...wagmiContractConfig,
    abi: [
      {
        name: 'constructor',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'address' }],
      },
      {
        name: 'function',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ type: 'string', name: 'function' }],
        outputs: [{ type: 'address' }],
      },
    ],
    publicClient,
  })
  await expect(
    contractNoIndexedEventArgs.read.constructor(),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    "The contract function \\"constructor\\" reverted with the following reason:
    execution reverted

    Contract Call:
      address:   0x0000000000000000000000000000000000000000
      function:  constructor()

    Docs: https://viem.sh/docs/contract/readContract.html
    Version: viem@1.0.2"
  `)
  await expect(
    contractNoIndexedEventArgs.read.function(['function']),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    "The contract function \\"function\\" reverted with the following reason:
    execution reverted

    Contract Call:
      address:   0x0000000000000000000000000000000000000000
      function:  function(string function)
      args:              (function)

    Docs: https://viem.sh/docs/contract/readContract.html
    Version: viem@1.0.2"
  `)
})

test.each([
  // without params
  {
    values: [['0x']],
    abiEvent: { inputs: [{ type: 'address' }] },
    expected: {
      args: ['0x'],
      params: {},
    },
  },
  {
    values: [{ from: '0x' }],
    abiEvent: { inputs: [{ name: 'from', type: 'address' }] },
    expected: {
      args: { from: '0x' },
      params: {},
    },
  },
  // with params
  {
    values: [['0x'], { fromBlock: 10_000n }],
    abiEvent: { inputs: [{ type: 'address' }] },
    expected: {
      args: ['0x'],
      params: { fromBlock: 10_000n },
    },
  },
  {
    values: [{ from: '0x' }, { fromBlock: 10_000n }],
    abiEvent: { inputs: [{ name: 'from', type: 'address' }] },
    expected: {
      args: { from: '0x' },
      params: { fromBlock: 10_000n },
    },
  },
  // only params
  {
    values: [{ fromBlock: 10_000n }],
    abiEvent: { inputs: [{ name: 'from', type: 'address' }] },
    expected: {
      args: undefined,
      params: { fromBlock: 10_000n },
    },
  },
  // no args
  {
    values: [],
    abiEvent: { inputs: [{ name: 'from', type: 'address' }] },
    expected: {
      args: undefined,
      params: {},
    },
  },
])(
  'getEventArgsAndParams($values, $abiEvent) -> $expected',
  async ({ values, abiEvent, expected }) => {
    expect(
      getEventArgsAndParams(values as any, abiEvent as unknown as AbiEvent),
    ).toEqual(expected)
  },
)

const contract_ = getContract({
  ...wagmiContractConfig,
  publicClient,
  walletClient,
})

// createEventFilter
contract_.createEventFilter.Transfer({})
contract_.createEventFilter.Transfer({ from: '0x' })
contract_.createEventFilter.Transfer({ from: '0x' }, { fromBlock: 10_000n })
contract_.createEventFilter.Approval(['0x', null])
contract_.createEventFilter.Approval([])
contract_.createEventFilter.ApprovalForAll()

// estimateGas
contract.estimateGas.mint({ account: '0x' })
contract.estimateGas.safeTransferFrom(['0x', '0x', 1n], {
  account: '0x',
})

// read
contract_.read.totalSupply()
contract_.read.balanceOf(['0x'])
contract_.read.balanceOf(['0x'], { blockNumber: 10_000n })

// simulate
contract_.simulate.mint({ account: '0x' })
contract_.simulate.safeTransferFrom(['0x', '0x', 1n], {
  account: '0x',
})

// watchEvent
contract_.watchEvent.Transfer({ onLogs })
contract_.watchEvent.Transfer({ args: { from: '0x' }, onLogs })
contract_.watchEvent.Approval({ args: ['0x', null], onLogs })

contract_.watchEvent.Transfer({ onLogs })
contract_.watchEvent.Transfer({ from: '0x' }, { onLogs })
contract_.watchEvent.Approval({ onLogs })
contract_.watchEvent.Approval(['0x', null], { onLogs })

// write
contract_.write.mint({ account: '0x' })
contract_.write.safeTransferFrom(['0x', '0x', 1n], {
  account: '0x',
})

function onLogs() {}

// no args: watch({ options })
// has args: watch({ foo: 'bar' }, { options })
// optional args: watch({}, { options })

// no args: read({ options })
// has args: read({ foo: 'bar' }, { options })

// TODO: check overloads with args and without
// mint()
// mint(uint256)
