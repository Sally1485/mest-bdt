/**
 * Shared property-based-testing helper for the company-invitations spec.
 *
 * Wraps `fc.assert` with the project defaults required by Requirement 14.9:
 *   - numRuns: 100
 *   - verbose: true (fast-check prints the failing seed and a minimal
 *     counterexample on failure, giving us a deterministic seed to replay).
 *
 * Callers can override any default (including pinning `seed`) by passing a
 * partial `Parameters` object as the second argument.
 *
 * Usage:
 *   pbt(fc.property(fc.string(), (s) => s.length >= 0));
 *   await pbt(fc.asyncProperty(fc.string(), async (s) => { ... }));
 *   pbt(prop, { seed: 42 }); // replay a previously-reported failing seed
 */
import * as fc from 'fast-check';
import type { IAsyncProperty, IProperty, Parameters } from 'fast-check';

const DEFAULT_NUM_RUNS = 100;
const DEFAULT_VERBOSE = true;

export function pbt<Ts>(
  property: IAsyncProperty<Ts>,
  opts?: Parameters<Ts>,
): Promise<void>;
export function pbt<Ts>(property: IProperty<Ts>, opts?: Parameters<Ts>): void;
export function pbt<Ts>(
  property: IProperty<Ts> | IAsyncProperty<Ts>,
  opts: Parameters<Ts> = {},
): void | Promise<void> {
  return fc.assert(property as IProperty<Ts>, {
    numRuns: DEFAULT_NUM_RUNS,
    verbose: DEFAULT_VERBOSE,
    ...opts,
  });
}
