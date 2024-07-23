import { useState, ChangeEvent, useEffect } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useBudget } from "../hooks/useBudget";
import ErrorMessage from "./ErrorMessage";

export const ExpenseForm = () => {
	const [expense, setExpense] = useState<DraftExpense>({
		amount: 0,
		expenseName: "",
		category: "",
		date: new Date(),
	});

	const { dispatch, state, remainingBudget } = useBudget();

	const [error, setError] = useState("");
	const [previousAmount, setPreviousAmount] = useState(0);

	useEffect(() => {
		if (state.editingId) {
			const editingExpense = state.expenses.filter(
				(e) => e.id === state.editingId
			)[0];
			setExpense(editingExpense);
			setPreviousAmount(editingExpense.amount);
		}
	}, [state.editingId]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		const isAmountField = ["amount"].includes(name);

		setExpense({
			...expense,
			[name]: isAmountField ? +value : value,
		});
	};

	const handleDateChange = (value: Value) => {
		setExpense({
			...expense,
			date: value,
		});
	};

	const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();

		//Validacion
		if (Object.values(expense).includes("")) {
			setError("Todos los campos son obligatorios");
			return;
		}

		// Validar que no me pase del presupuesto
		if (expense.amount - previousAmount > remainingBudget) {
			setError("El gasto excede el presupuesto");
			return;
		}

		// Agregar o actualizar gasto
		if (state.editingId) {
			dispatch({
				type: "edit-expense",
				payload: { expense: { id: state.editingId, ...expense } },
			});
		} else {
			dispatch({
				type: "add-expense",
				payload: { expense },
			});
		}

		// Reiniciar el state
		setExpense({
			amount: 0,
			expenseName: "",
			category: "",
			date: new Date(),
		});
		setPreviousAmount(0);
	};
	return (
		<>
			<form className="space-y-5 " onSubmit={handleSubmit}>
				<legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
					{state.editingId ? "Editar Gasto" : "Nuevo Gasto"}
				</legend>

				{error && <ErrorMessage>{error}</ErrorMessage>}

				<div className="flex flex-col gap-2">
					<label htmlFor="expenseName" className="text-xl">
						Nombre Gasto:
					</label>

					<input
						type="text"
						id="expenseName"
						className="bg-slate-100 p-2"
						placeholder="Añade el nombre del gasto"
						name="expenseName"
						value={expense.expenseName}
						onChange={handleChange}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="amount" className="text-xl">
						Cantidad:
					</label>

					<input
						type="number"
						id="amount"
						className="bg-slate-100 p-2"
						placeholder="Añade la cantidad del gasto. Ej: 300"
						name="amount"
						value={expense.amount === 0 ? "" : expense.amount}
						onChange={handleChange}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="category" className="text-xl">
						Categoria:
					</label>

					<select
						id="category"
						className="bg-slate-100 p-2 cursor-pointer"
						name="category"
						value={expense.category}
						onChange={handleChange}>
						<option value="">--Seleccione--</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="date" className="text-xl">
						Fecha Gasto:
					</label>

					<DatePicker
						className="bg-slate-100 p-2 border-0"
						value={expense.date}
						onChange={handleDateChange}
					/>
				</div>

				<input
					type="submit"
					className="bg-blue-600 cursor-pointer w-full p-2 rounded-lg text-white uppercase font-bold hover:bg-blue-500"
					value={state.editingId ? "Guardar Cambios" : "Registrar Gasto"}
				/>
			</form>
		</>
	);
};
