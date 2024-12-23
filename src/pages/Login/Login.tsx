import styles from './Login.module.css';
import Headling from '../../components/Headling/Headling';
import CheckBoxItem from '../../components/CheckBoxItem/CheckBoxItem';
import InputLabel from '../../components/InputLabel/InputLabel';
import Button from '../../components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import { RootState } from '../../app/store';
import { sendSmsCode, resetAuth, verifySmsCode } from '../../features/auth/authSlice';
import { AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import Vendor from '../../components/Vendor/Vendor';
import cn from 'classnames';
import useTimer from '../../hooks/useTimer';

export function Login() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const codeInputRef = useRef<HTMLInputElement>(null);
    const { status, error, isCodeSent, isAuthenticated } = useSelector((state: RootState) => state.auth);
	const [vendorActive, setVendorActive] = useState(false);
	const [ showResendButton, setShowResendButton] = useState(false);
	const { timeLeft, startTimer } = useTimer(59);
	const userType = isAdmin ? 'Школа' : 'Студент';
	
	useEffect(() => {
		if (isCodeSent) {
			startTimer();
		}
	}, [isCodeSent, startTimer]);

	useEffect(() => {
		setShowResendButton(timeLeft === 0)
	}, [timeLeft]);

    const handleSendCode = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await dispatch(sendSmsCode({ phone, isAdmin })).unwrap();
		} catch (error) {
			console.log('Ошибка отправки кода:', error)
		}
	};

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await dispatch(verifySmsCode({ phone, code })).unwrap();
			navigate('/');
		} catch (error) {
			console.error('Ошибка проверки кода:', error);
		}
	}

	const handleResendCode = () => {
        dispatch(sendSmsCode({phone, isAdmin}));
		startTimer();
    };

	const handleReset = () => {
        setCode('');
        setIsAdmin(false);
        dispatch(resetAuth());
    };

	const handleResetForm = () => {
		setPhone('');
        setCode('');
        setIsAdmin(false);
        dispatch(resetAuth());
    };

	useEffect(() => {
		if(isAuthenticated) {
			navigate('/');
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		if(error) {
			setVendorActive(true);
			const timer = setTimeout(() => setVendorActive(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	const handleInputChange = (
		valueOrEvent: string | React.ChangeEvent<HTMLInputElement>,
		onChange: React.Dispatch<React.SetStateAction<string>>
	) => {
		if (typeof valueOrEvent === "string") {
			onChange(valueOrEvent);
		} else {
			onChange(valueOrEvent.target.value);
		}
	};

	return(
		<>
			<div className={styles['login']}>
				<div className={styles['login__wrap']}>
					<div className={styles['login-logo']}>
						<img src="/logo.svg" alt="" />
					</div>
					<form className={styles['form']} onSubmit={isCodeSent ? handleVerifyCode : handleSendCode}>
						<Headling className={styles['title']}>Авторизация</Headling>
						{!isCodeSent ? (
							<CheckBoxItem 
								isChecked={isAdmin}
								onChange={(checked) => setIsAdmin(checked)}
							/>
						) : (
							<button
								className={styles['user-btn']}
								type="button"
								onClick={handleReset}
							>
								<span>{userType}</span>
								<img src="/fix.svg" alt="" />
							</button>
						)}
						<div className={styles['form__wrap']}>
							<div className={styles['form__label']}>
								<InputLabel 
									label="Телефон" 
									type='input' 
									id='phone' 
									mask='+7 (999) 999-99-99'
									value={phone}
									onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setPhone)}
									className={isCodeSent ? styles['blocked'] : undefined}
									hideClearButton
								/>
								{!isCodeSent ? undefined : (
									<button
										className={styles['reset-btn']}
										type="button"
										onClick={handleResetForm}
									>
										<img src="/reset.svg" alt="" />
									</button>
								)}
							</div>
							{isCodeSent && (
								<>
									<InputLabel 
										label="Код"
										type="input"
										id="code"
										ref={codeInputRef}
										value={code}
										mask='9999'
										onChange={(valueOrEvent) => handleInputChange(valueOrEvent, setCode)}
										hideClearButton
									/>
									<div className={styles['code-info']}>
										<p>Не пришёл код?</p>
										{showResendButton ? (
											<button className={styles['code-info-btn']} onClick={handleResendCode}>Отправить код</button>
										) : (
											<p>Отправить повторно через: {' '}
												<span>
													00:{timeLeft.toString().padStart(2, '0')}
												</span>
											</p>
										)}
									</div>
								</>
							)}
						</div>
						<Button className={styles['form__btn']} appearance='big' type='submit'>
							{isCodeSent ? 'Войти' : 'Получить код'}
						</Button>
					</form>
				</div>
			</div>
			<Vendor className={cn({ [styles.active]: vendorActive})}>
				{status === 'loading' && <p>Авторизация...</p>}
				{error && <p>Ошибка: {error}</p>}
			</Vendor>
		</>
	);
};

