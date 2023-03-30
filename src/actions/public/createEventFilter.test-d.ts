import { test } from 'vitest'
import { publicClient } from '../../_test'
import { createEventFilter } from './createEventFilter'

test('createEventFilter', () => {
  const res = createEventFilter(publicClient, {
    event: {
      name: 'Foo',
      type: 'event',
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'foo',
          type: 'address',
        },
        {
          indexed: true,
          name: 'bar',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'baz',
          type: 'bool',
        },
      ],
    },
    args: {
      foo: '0x',
    },
  })

  const res2 = createEventFilter(publicClient, {
    event: {
      name: 'Foo',
      type: 'event',
      anonymous: false,
      inputs: [
        { indexed: true, type: 'address' },
        { indexed: true, type: 'uint256' },
        { indexed: false, type: 'bool' },
      ],
    },
    args: ['0x'],
  })

  const res3 = createEventFilter(publicClient, {
    event: {
      name: 'Foo',
      type: 'event',
      anonymous: false,
      inputs: [],
    },
  })

  const res4 = createEventFilter(publicClient, {})
})
