import type { Abi } from 'abitype'
import type { MaybeExtractEventArgsFromAbi } from './contract'
import type { Hex } from './misc'

export type FilterType = 'transaction' | 'block' | 'event'

export type Filter<
  TFilterType extends FilterType = 'event',
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string | undefined = undefined,
  TArgs extends
    | MaybeExtractEventArgsFromAbi<TAbi, TEventName>
    | undefined = MaybeExtractEventArgsFromAbi<TAbi, TEventName>,
> = {
  id: Hex
  type: TFilterType
} & (TFilterType extends 'event'
  ? TAbi extends Abi
    ? undefined extends TEventName
      ? {
          abi: TAbi
          args?: never
          eventName?: never
        }
      : TArgs extends MaybeExtractEventArgsFromAbi<TAbi, TEventName>
      ? {
          abi: TAbi
          args: TArgs
          eventName: TEventName
        }
      : {
          abi: TAbi
          args?: never
          eventName: TEventName
        }
    : {
        abi?: never
        args?: never
        eventName?: never
      }
  : unknown)
