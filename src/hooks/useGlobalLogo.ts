// import { useEffect, useState } from 'react';
// import { fetchGlobalData } from '../helpers/API';

// export function useGlobalLogo() {
//     const [logoUrl, setLogoUrl] = useState<string | null>(null);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const loadGlobalData = async () => {
//             try {
//                 const data = await fetchGlobalData();
//                 console.log("Ответ API:", data);
//                 setLogoUrl(data.logo);
//             } catch (err) {
//                 setError('Не удалось загрузить логотип');
//                 console.error(err);
//             }
//         };

//         loadGlobalData();
//     }, []);

//     return { logoUrl, error };
// }
