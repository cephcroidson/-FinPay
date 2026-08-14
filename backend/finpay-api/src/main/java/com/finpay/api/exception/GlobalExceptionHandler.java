package com.finpay.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(
            IllegalArgumentException exception) {

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage()
        );
    }

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleAccountNotFound(
            AccountNotFoundException exception) {

        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFound(
            UserNotFoundException exception) {

        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateResource(
            DuplicateResourceException exception) {

        return buildResponse(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }
        @ExceptionHandler(TransactionNotFoundException.class)
public ResponseEntity<Map<String, Object>> handleTransactionNotFound(
        TransactionNotFoundException exception) {

    return buildResponse(
            HttpStatus.NOT_FOUND,
            exception.getMessage()
    );
}
    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status,
            String message) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("timestamp", Instant.now());
        response.put("status", status.value());
        response.put("error", status.getReasonPhrase());
        response.put("message", message);

        return ResponseEntity
                .status(status)
                .body(response);
    }
}
