import { useCallback, useEffect, useState } from "react";


type UseTimerReturn = {
	timeLeft: number;
	startTimer: () => void;
	resetTimer: () => void;
};

const useTimer = (initialTime: number): UseTimerReturn => {
	const [timeLeft, setTimeLeft] = useState(initialTime);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if(!isActive) return;

		const timerId = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timerId);
					setIsActive(false);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timerId);
	}, [isActive]);

	const startTimer = useCallback(() => {
		setTimeLeft(initialTime);
		setIsActive(true);
	}, [initialTime]);

	const resetTimer = useCallback(() => {
		setTimeLeft(initialTime);
		setIsActive(false);
	}, [initialTime]);

	return { timeLeft, startTimer, resetTimer };
}

export default useTimer;