import { createSeed, type Db } from './data/seed'

/** The mocks' "database": lives in browser memory (or in the test process). */
let db: Db = createSeed()

export const getDb = (): Db => db

/** Restores the initial data (used in tests after each test). */
export const resetDb = (): void => {
  db = createSeed()
}
