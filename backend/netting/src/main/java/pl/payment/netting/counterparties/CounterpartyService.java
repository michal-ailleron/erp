package pl.payment.netting.counterparties;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import pl.payment.netting.api.model.Counterparty;
import pl.payment.netting.api.model.CounterpartyKind;
import pl.payment.netting.api.model.CounterpartyPage;

@Service
class CounterpartyService {

	private final CounterpartyRepository repository;

	CounterpartyService(CounterpartyRepository repository) {
		this.repository = repository;
	}

	CounterpartyPage list(int page, int pageSize, String q, CounterpartyKind kind) {
		List<Counterparty> matching = repository.findAll().stream()
				.filter(c -> kind == null || c.getKind() == kind)
				.filter(c -> matchesText(q, c.getName(), c.getTaxId(), c.getCity()))
				.toList();

		int from = (int) Math.min((long) (page - 1) * pageSize, matching.size());
		int to = (int) Math.min((long) from + pageSize, matching.size());

		return new CounterpartyPage()
				.items(matching.subList(from, to))
				.page(page)
				.pageSize(pageSize)
				.total((long) matching.size());
	}

	private static boolean matchesText(String q, String... fields) {
		if (q == null || q.isBlank()) {
			return true;
		}
		String needle = q.toLowerCase(Locale.ROOT);
		for (String field : fields) {
			if (field.toLowerCase(Locale.ROOT).contains(needle)) {
				return true;
			}
		}
		return false;
	}
}
