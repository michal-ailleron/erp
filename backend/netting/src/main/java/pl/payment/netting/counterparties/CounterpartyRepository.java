package pl.payment.netting.counterparties;

import java.util.List;

import pl.payment.netting.api.model.Counterparty;

/** Źródło kontrahentów. Teraz pamięć z danymi syntetycznymi, później baza danych. */
public interface CounterpartyRepository {

	List<Counterparty> findAll();
}
