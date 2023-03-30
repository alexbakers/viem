import type { seaportAbi } from 'abitype/test'
import { test } from 'vitest'
import type { Filter } from './filter'

// CounterIncremented, OrderCancelled, OrderFulfilled
test('Filter', () => {
  type Result = Filter<'event', typeof seaportAbi, 'CounterIncremented'>
})
