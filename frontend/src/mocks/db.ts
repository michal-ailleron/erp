import { createSeed, type Db } from './data/seed'

/** "Baza danych" mocków: żyje w pamięci przeglądarki (lub procesu testowego). */
let db: Db = createSeed()

export const getDb = (): Db => db

/** Przywraca dane początkowe (używane w testach po każdym teście). */
export const resetDb = (): void => {
  db = createSeed()
}
