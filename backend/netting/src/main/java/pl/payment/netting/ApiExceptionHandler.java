package pl.payment.netting;

import jakarta.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import pl.payment.netting.api.model.Error;

/** Errors in the `Error` schema format from the contract: {"message": "..."}; the frontend reads the `message` field. */
@RestControllerAdvice
class ApiExceptionHandler {

	/** Generated interfaces carry @Validated, so method validation reports @Min/@Max violations. */
	@ExceptionHandler(ConstraintViolationException.class)
	ResponseEntity<Error> handleConstraintViolation(ConstraintViolationException exception) {
		return badRequest("Nieprawidłowe parametry zapytania.");
	}

	@ExceptionHandler(HandlerMethodValidationException.class)
	ResponseEntity<Error> handleValidation(HandlerMethodValidationException exception) {
		return badRequest("Nieprawidłowe parametry zapytania.");
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	ResponseEntity<Error> handleTypeMismatch(MethodArgumentTypeMismatchException exception) {
		return badRequest("Nieprawidłowa wartość parametru '" + exception.getName() + "'.");
	}

	private static ResponseEntity<Error> badRequest(String message) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Error().message(message));
	}
}
