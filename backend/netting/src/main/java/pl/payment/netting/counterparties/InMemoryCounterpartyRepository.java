package pl.payment.netting.counterparties;

import java.util.List;
import java.util.stream.IntStream;

import org.springframework.stereotype.Component;

import pl.payment.netting.api.model.Counterparty;
import pl.payment.netting.api.model.CounterpartyKind;

/**
 * Mock po stronie backendu: te same dane syntetyczne co w frontend/src/mocks/data/seed.ts
 * (ten sam generator liczb pseudolosowych i ta sama kolejność losowań, więc NIP-y i rachunki się zgadzają).
 * Wszystkie nazwy firm, numery NIP i rachunki są zmyślone.
 */
@Component
class InMemoryCounterpartyRepository implements CounterpartyRepository {

	private record Seed(String name, String city, CounterpartyKind kind) {
	}

	private static final List<Seed> SEED = List.of(
			new Seed("Nordwind Logistyka Sp. z o.o.", "Gdańsk", CounterpartyKind.CUSTOMER),
			new Seed("Pracownia Kartograficzna Lumen", "Kraków", CounterpartyKind.CUSTOMER),
			new Seed("Browar Dolina Sp. k.", "Wrocław", CounterpartyKind.CUSTOMER),
			new Seed("Studio Okiennica Sp. z o.o.", "Poznań", CounterpartyKind.CUSTOMER),
			new Seed("Kalinowski Transport", "Łódź", CounterpartyKind.CUSTOMER),
			new Seed("Bałtyckie Chłodnie S.A.", "Szczecin", CounterpartyKind.CUSTOMER),
			new Seed("Technika Grzewcza Orzeł", "Katowice", CounterpartyKind.BOTH),
			new Seed("Agencja Reklamowa Pion", "Warszawa", CounterpartyKind.SUPPLIER),
			new Seed("Hurtownia Tulipan Sp. z o.o.", "Lublin", CounterpartyKind.BOTH),
			new Seed("Warsztat Optyki Prosta", "Białystok", CounterpartyKind.CUSTOMER),
			new Seed("Chmura Serwis Sp. z o.o.", "Warszawa", CounterpartyKind.SUPPLIER),
			new Seed("Biuro Rachunkowe Bilans", "Łódź", CounterpartyKind.SUPPLIER));

	private static final long RNG_SEED = 20261029;

	private final List<Counterparty> counterparties = createCounterparties();

	@Override
	public List<Counterparty> findAll() {
		return counterparties;
	}

	private static List<Counterparty> createCounterparties() {
		Mulberry32 rng = new Mulberry32((int) RNG_SEED);
		return IntStream.range(0, SEED.size()).mapToObj(i -> {
			Seed seed = SEED.get(i);
			// Kolejność losowań jak w seed.ts: NIP, potem liczba rachunków, potem same rachunki.
			String taxId = rng.integer(1, 9) + rng.digits(9);
			int ibanCount = rng.integer(1, 2);
			List<String> ibans = IntStream.range(0, ibanCount).mapToObj(n -> "PL" + rng.digits(26)).toList();
			return new Counterparty()
					.id("cp-%02d".formatted(i + 1))
					.name(seed.name())
					.taxId(taxId)
					.city(seed.city())
					.kind(seed.kind())
					.ibans(ibans);
		}).toList();
	}

	/** Port generatora mulberry32 z frontendu, żeby dane były identyczne po obu stronach. */
	private static final class Mulberry32 {

		private int state;

		Mulberry32(int seed) {
			this.state = seed;
		}

		double next() {
			state += 0x6d2b79f5;
			int t = (state ^ (state >>> 15)) * (1 | state);
			t = (t + ((t ^ (t >>> 7)) * (61 | t))) ^ t;
			return Integer.toUnsignedLong(t ^ (t >>> 14)) / 4294967296.0;
		}

		int integer(int min, int max) {
			return min + (int) Math.floor(next() * (max - min + 1));
		}

		String digits(int count) {
			StringBuilder builder = new StringBuilder(count);
			for (int i = 0; i < count; i++) {
				builder.append(integer(0, 9));
			}
			return builder.toString();
		}
	}
}
