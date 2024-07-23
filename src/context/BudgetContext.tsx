import { useReducer, createContext, Dispatch, ReactNode, useMemo } from "react";
import {
	budgetReducer,
	budgetState,
	initialState,
	budgetActions,
} from "../reducers/budget-reducer";

type budgetContextProps = {
	state: budgetState;
	dispatch: Dispatch<budgetActions>;
	totalExpenses: number;
	remainingBudget: number;
};

type budgetProviderProps = {
	children: ReactNode;
};

export const BudgetContext = createContext<budgetContextProps>(null!);

export const BudgetProvider = ({ children }: budgetProviderProps) => {
	const [state, dispatch] = useReducer(budgetReducer, initialState);

	const totalExpenses = useMemo(() => {
		return state.expenses.reduce((acc, expense) => acc + expense.amount, 0);
	}, [state.expenses]);

	const remainingBudget = useMemo(() => {
		return state.budget - totalExpenses;
	}, [state.budget, totalExpenses]);

	return (
		<BudgetContext.Provider
			value={{ state, dispatch, totalExpenses, remainingBudget }}>
			{children}
		</BudgetContext.Provider>
	);
};
