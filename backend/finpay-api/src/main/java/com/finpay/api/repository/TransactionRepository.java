package com.finpay.api.repository;

import com.finpay.api.entity.Transaction;
import com.finpay.api.entity.TransactionStatus;
import com.finpay.api.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByReference(String reference);

    List<Transaction> findBySourceAccountId(Long accountId);

    List<Transaction> findByDestinationAccountId(Long accountId);

    List<Transaction> findByType(TransactionType type);

    List<Transaction> findByStatus(TransactionStatus status);

    boolean existsByReference(String reference);
}
