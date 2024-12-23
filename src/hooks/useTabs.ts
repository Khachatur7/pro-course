import { useState } from "react";

const useTabs = (initialTab = 0) => {
	const [activeTab, setActiveTab] = useState(initialTab);

	const handleTabClick = (index: number) => setActiveTab(index);
	
	return { activeTab, handleTabClick };
}

export default useTabs;