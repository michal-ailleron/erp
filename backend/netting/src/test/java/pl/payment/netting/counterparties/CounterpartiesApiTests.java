package pl.payment.netting.counterparties;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CounterpartiesApiTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void returnsFirstPageWithDefaults() throws Exception {
		mockMvc.perform(get("/api/counterparties"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.page").value(1))
				.andExpect(jsonPath("$.pageSize").value(10))
				.andExpect(jsonPath("$.total").value(12))
				.andExpect(jsonPath("$.items.length()").value(10))
				.andExpect(jsonPath("$.items[0].id").value("cp-01"))
				.andExpect(jsonPath("$.items[0].taxId").isString())
				.andExpect(jsonPath("$.items[0].ibans").isNotEmpty());
	}

	@Test
	void pagesThroughResults() throws Exception {
		mockMvc.perform(get("/api/counterparties").param("page", "2").param("pageSize", "10"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.items.length()").value(2))
				.andExpect(jsonPath("$.total").value(12));
	}

	@Test
	void pageBeyondTheEndIsEmptyNotAnError() throws Exception {
		mockMvc.perform(get("/api/counterparties").param("page", "99"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.items.length()").value(0))
				.andExpect(jsonPath("$.total").value(12));
	}

	@Test
	void filtersByKind() throws Exception {
		mockMvc.perform(get("/api/counterparties").param("kind", "SUPPLIER"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.total").value(3))
				.andExpect(jsonPath("$.items[*].kind").value(org.hamcrest.Matchers.everyItem(org.hamcrest.Matchers.is("SUPPLIER"))));
	}

	@Test
	void searchesByNameTaxIdOrCityIgnoringCase() throws Exception {
		mockMvc.perform(get("/api/counterparties").param("q", "warszawa"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.total").value(2));
	}

	@Test
	void combinesKindAndSearch() throws Exception {
		mockMvc.perform(get("/api/counterparties").param("kind", "SUPPLIER").param("q", "łódź"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.total").value(1))
				.andExpect(jsonPath("$.items[0].name").value("Biuro Rachunkowe Bilans"));
	}

	@Test
	void rejectsPageSizeOutsideContractRange() throws Exception {
		mockMvc.perform(get("/api/counterparties").param("pageSize", "0"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").isString());
		mockMvc.perform(get("/api/counterparties").param("pageSize", "101"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void rejectsUnknownKind() throws Exception {
		mockMvc.perform(get("/api/counterparties").param("kind", "NOPE"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").isString());
	}
}
