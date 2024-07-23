import { ReactNode } from "react";

type ErrorMessageProps = {
	children: ReactNode;
};

export default function ErrorMessage({ children }: ErrorMessageProps) {
	return (
		<>
			<p className="bg-red-600 p-2 text-white text-sm font-bold text-center">
				{children}
			</p>
		</>
	);
}
