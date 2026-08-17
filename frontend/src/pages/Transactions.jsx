import { useEffect, useState } from "react";
import {
    deposit,
    withdraw,
    transfer,
    getAccountTransactions,
} from "../api/transactionApi";

const ACCOUNT_ID = 8;

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        type: "DEPOSIT",
        amount: "",
        destinationAccountId: "",
        description: "",
    });

    async function loadTransactions() {
        try {
            setError("");

            const data = await getAccountTransactions(ACCOUNT_ID);

            setTransactions(data);
        } catch (err) {
            setError(
                err.message || "Failed to load transactions"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        const amount = Number(form.amount);

        if (!amount || amount <= 0) {
            setError("Amount must be greater than zero.");
            return;
        }

        if (
            form.type === "TRANSFER" &&
            !form.destinationAccountId
        ) {
            setError("Destination account is required.");
            return;
        }

        try {
            setSubmitting(true);

            let result;

            if (form.type === "DEPOSIT") {
                result = await deposit(
                    ACCOUNT_ID,
                    amount,
                    form.description
                );
            }

            if (form.type === "WITHDRAW") {
                result = await withdraw(
                    ACCOUNT_ID,
                    amount,
                    form.description
                );
            }

            if (form.type === "TRANSFER") {
                result = await transfer(
                    ACCOUNT_ID,
                    Number(form.destinationAccountId),
                    amount,
                    form.description
                );
            }

            setSuccess(
                `${form.type} completed successfully.`
            );

            setForm({
                type: form.type,
                amount: "",
                destinationAccountId: "",
                description: "",
            });

            await loadTransactions();

            console.log("Transaction result:", result);
        } catch (err) {
            setError(
                err.message || "Transaction failed."
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <section className="transactions-section">
                <p>Loading transactions...</p>
            </section>
        );
    }

    return (
        <section className="transactions-section">

            <div className="section-heading">
                <p className="eyebrow">PAYMENTS</p>
                <h2>Make a Transaction</h2>
            </div>

            <form
                className="transaction-form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">
                    <label htmlFor="type">
                        Transaction Type
                    </label>

                    <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                    >
                        <option value="DEPOSIT">
                            Deposit
                        </option>

                        <option value="WITHDRAW">
                            Withdrawal
                        </option>

                        <option value="TRANSFER">
                            Transfer
                        </option>
                    </select>
                </div>

                {form.type === "TRANSFER" && (
                    <div className="form-group">
                        <label htmlFor="destinationAccountId">
                            Destination Account ID
                        </label>

                        <input
                            id="destinationAccountId"
                            name="destinationAccountId"
                            type="number"
                            min="1"
                            value={form.destinationAccountId}
                            onChange={handleChange}
                            placeholder="e.g. 6"
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="amount">
                        Amount
                    </label>

                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">
                        Description
                    </label>

                    <input
                        id="description"
                        name="description"
                        type="text"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Transaction description"
                    />
                </div>

                {error && (
                    <div className="transaction-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="transaction-success">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting
                        ? "Processing..."
                        : `Submit ${form.type}`}
                </button>
            </form>

            <div className="section-heading transaction-history-heading">
                <p className="eyebrow">ACTIVITY</p>
                <h2>Recent Transactions</h2>
            </div>

            {transactions.length === 0 ? (
                <div className="empty-transactions">
                    <h3>No transactions yet</h3>

                    <p>
                        Your account transactions will
                        appear here.
                    </p>
                </div>
            ) : (
                <div className="transaction-list">

                    {transactions.map((transaction) => (
                        <div
                            className="transaction-item"
                            key={transaction.id}
                        >

                            <div>
                                <h3>
                                    {transaction.type}
                                </h3>

                                <p>
                                    {transaction.description ||
                                        "No description"}
                                </p>
                            </div>

                            <div className="transaction-right">

                                <strong>
                                    KES{" "}
                                    {Number(
                                        transaction.amount
                                    ).toFixed(2)}
                                </strong>

                                <span
                                    className={`transaction-status ${String(
                                        transaction.status
                                    ).toLowerCase()}`}
                                >
                                    {transaction.status}
                                </span>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </section>
    );
}

export default Transactions;
