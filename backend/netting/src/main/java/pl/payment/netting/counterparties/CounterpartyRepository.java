package pl.payment.netting.counterparties;

import java.util.List;

import pl.payment.netting.api.model.Counterparty;

/** Source of counterparties. Currently in-memory synthetic data; a database later. */
public interface CounterpartyRepository {

	List<Counterparty> findAll();
}
