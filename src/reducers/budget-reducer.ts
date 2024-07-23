import { v4 as uuidv4 } from "uuid";
import { DraftExpense, Expense, Category } from "../types";

export type budgetActions =
	| { type: "add-budget"; payload: { budget: number } }
	| { type: "show-modal" }
	| { type: "close-modal" }
	| { type: "add-expense"; payload: { expense: DraftExpense } }
	| { type: "remove-expense"; payload: { id: Expense["id"] } }
	| { type: "get-expense-by-id"; payload: { id: Expense["id"] } }
	| { type: "edit-expense"; payload: { expense: Expense } }
	| { type: "reset-app" }
	| { type: "filter-category"; payload: { id: Category["id"] } };

export type budgetState = {
	budget: number;
	modal: boolean;
	expenses: Expense[];
	editingId: Expense["id"];
	currentCategory: Category["id"];
};

const initialBudget = (): number => {
	const localStorageBudget = localStorage.getItem("budget");
	return localStorageBudget ? +localStorageBudget : 0;
};

const initialExpense = (): Expense[] => {
	const localStorageExpense = localStorage.getItem("expense");
	return localStorageExpense ? JSON.parse(localStorageExpense) : [];
};

export const initialState: budgetState = {
	budget: initialBudget(),
	modal: false,
	expenses: initialExpense(),
	editingId: "",
	currentCategory: "",
};

const createExpense = (draftExpense: DraftExpense): Expense => {
	return {
		...draftExpense,
		id: uuidv4(),
	};
};

export const budgetReducer = (
	state: budgetState = initialState,
	action: budgetActions
) => {
	switch (action.type) {
		case "add-budget":
			return {
				...state,
				budget: state.budget + action.payload.budget,
			};
		case "show-modal":
			return {
				...state,
				modal: true,
			};
		case "close-modal":
			return {
				...state,
				modal: false,
				editingId: "",
			};
		case "add-expense": {
			const expense = createExpense(action.payload.expense);

			return {
				...state,
				expenses: [...state.expenses, expense],
				modal: false,
			};
		}
		case "remove-expense":
			return {
				...state,
				expenses: state.expenses.filter(
					(expense) => expense.id !== action.payload.id
				),
			};
		case "get-expense-by-id":
			return {
				...state,
				editingId: action.payload.id,
				modal: true,
			};
		case "edit-expense": {
			return {
				...state,
				expenses: state.expenses.map((expense) =>
					expense.id === action.payload.expense.id
						? action.payload.expense
						: expense
				),
				modal: false,
				editingId: "",
			};
		}
		case "reset-app":
			return {
				...state,
				budget: 0,
				expenses: [],
			};
		case "filter-category":
			return {
				...state,
				currentCategory: action.payload.id,
			};
		default:
			return state;
	}
};
