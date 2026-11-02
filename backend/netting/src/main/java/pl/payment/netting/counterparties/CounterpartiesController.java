package pl.payment.netting.counterparties;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import pl.payment.netting.api.CounterpartiesApi;
import pl.payment.netting.api.model.CounterpartyKind;
import pl.payment.netting.api.model.CounterpartyPage;

/** Implementacja interfejsu wygenerowanego z contract/openapi.yaml. */
@RestController
class CounterpartiesController implements CounterpartiesApi {

	private final CounterpartyService service;

	CounterpartiesController(CounterpartyService service) {
		this.service = service;
	}

	@Override
	public ResponseEntity<CounterpartyPage> listCounterparties(Integer page, Integer pageSize, String q,
			CounterpartyKind kind) {
		return ResponseEntity.ok(service.list(page, pageSize, q, kind));
	}
}
