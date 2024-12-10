import { useState, useEffect  } from "react";


const useNotifications = () => {
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [vendorActive, setVendorActive] = useState(false);

	useEffect(() => {
		if(message || error) {
			setVendorActive(true);
			const time = setTimeout(() => setVendorActive(false), 3000);
			return () => clearTimeout(time);
		}
	}, [message, error]);

	return { message, setMessage, error, setError, vendorActive };
};

export default useNotifications;

