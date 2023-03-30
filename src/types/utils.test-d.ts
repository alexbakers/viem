import { test, expectTypeOf } from 'vitest'
import type { Filter, IsNever, IsUndefined, IsUnion, RequiredBy } from './utils'

test('Filter', () => {
  expectTypeOf<Filter<[1, 'foo', false, 'baz'], 1 | boolean>>().toEqualTypeOf<
    readonly [1, false]
  >()
})

test('IsNever', () => {
  expectTypeOf<IsNever<never>>().toEqualTypeOf<true>()

  expectTypeOf<IsNever<'never'>>().toEqualTypeOf<false>()
  expectTypeOf<IsNever<undefined>>().toEqualTypeOf<false>()
  expectTypeOf<IsNever<null>>().toEqualTypeOf<false>()
  expectTypeOf<IsNever<0>>().toEqualTypeOf<false>()
  expectTypeOf<IsNever<false>>().toEqualTypeOf<false>()
  expectTypeOf<IsNever<[]>>().toEqualTypeOf<false>()
  expectTypeOf<IsNever<{}>>().toEqualTypeOf<false>()
  expectTypeOf<IsNever<never[]>>().toEqualTypeOf<false>()
})

test('IsUndefined', () => {
  expectTypeOf<IsUndefined<undefined>>().toEqualTypeOf<true>()

  expectTypeOf<IsUndefined<never>>().toEqualTypeOf<false>()
  expectTypeOf<IsUndefined<'never'>>().toEqualTypeOf<false>()
  expectTypeOf<IsUndefined<null>>().toEqualTypeOf<false>()
  expectTypeOf<IsUndefined<0>>().toEqualTypeOf<false>()
  expectTypeOf<IsUndefined<false>>().toEqualTypeOf<false>()
  expectTypeOf<IsUndefined<[]>>().toEqualTypeOf<false>()
  expectTypeOf<IsUndefined<{}>>().toEqualTypeOf<false>()
  expectTypeOf<IsUndefined<undefined[]>>().toEqualTypeOf<false>()
})

test('IsUnion', () => {
  expectTypeOf<IsUnion<string | number>>().toEqualTypeOf<true>()
  expectTypeOf<IsUnion<string | readonly []>>().toEqualTypeOf<true>()
  expectTypeOf<IsUnion<undefined | []>>().toEqualTypeOf<true>()

  expectTypeOf<IsUnion<undefined>>().toEqualTypeOf<false>()
  expectTypeOf<IsUnion<never>>().toEqualTypeOf<false>()
  expectTypeOf<IsUnion<string | string>>().toEqualTypeOf<false>()
})

test('RequiredBy', () => {
  expectTypeOf<
    RequiredBy<{ a?: number; b?: string; c: boolean }, 'a' | 'c'>
  >().toEqualTypeOf<{ a: number; b?: string; c: boolean }>()
})
