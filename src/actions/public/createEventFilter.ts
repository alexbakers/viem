import type { Abi, AbiEvent, Narrow } from 'abitype'
import type { PublicClient, Transport } from '../../clients'

import type {
  Address,
  BlockNumber,
  BlockTag,
  Chain,
  Filter,
  GetEventArgs,
  LogTopic,
  MaybeAbiEventName,
  MaybeExtractEventArgsFromAbi,
  Prettify,
} from '../../types'
import {
  encodeEventTopics,
  EncodeEventTopicsParameters,
  numberToHex,
} from '../../utils'

export type CreateEventFilterParameters<
  TAbiEvent extends AbiEvent | undefined = AbiEvent,
  TAbi extends Abi | readonly unknown[] = [TAbiEvent],
  TEventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
> = {
  address?: Address | Address[]
  fromBlock?: BlockNumber | BlockTag
  toBlock?: BlockNumber | BlockTag
  event?: Narrow<TAbiEvent>
} & (TEventName extends string ? GetEventArgs<TAbi, TEventName> : unknown)

export type CreateEventFilterReturnType<
  TAbiEvent extends AbiEvent | undefined = AbiEvent,
  TAbi extends Abi | readonly unknown[] = [TAbiEvent],
  TEventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
  TArgs extends
    | MaybeExtractEventArgsFromAbi<TAbi, TEventName>
    | undefined = undefined,
> = Prettify<Filter<'event', TAbi, TEventName, TArgs>>

export async function createEventFilter<
  TChain extends Chain | undefined,
  TAbiEvent extends AbiEvent | undefined,
>(
  client: PublicClient<Transport, TChain>,
  {
    address,
    event,
    fromBlock,
    toBlock,
    ...rest
  }: CreateEventFilterParameters<TAbiEvent> = {} as any,
): Promise<CreateEventFilterReturnType<TAbiEvent>> {
  const args = (rest as unknown as { args: readonly unknown[] }).args
  let topics: LogTopic[] = []
  if (event)
    topics = encodeEventTopics({
      abi: [event],
      eventName: (event as AbiEvent).name,
      args,
    } as EncodeEventTopicsParameters)

  const id = await client.request({
    method: 'eth_newFilter',
    params: [
      {
        address,
        fromBlock:
          typeof fromBlock === 'bigint' ? numberToHex(fromBlock) : fromBlock,
        toBlock: typeof toBlock === 'bigint' ? numberToHex(toBlock) : toBlock,
        ...(topics.length ? { topics } : {}),
      },
    ],
  })
  return {
    abi: event ? [event] : undefined,
    args,
    eventName: event ? (event as AbiEvent).name : undefined,
    id,
    type: 'event',
  } as unknown as CreateEventFilterReturnType<TAbiEvent>
}
