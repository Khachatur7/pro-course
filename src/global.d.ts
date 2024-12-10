export {};

declare global {
	interface Window {
		showVendorInfo: (title: string, description: string) => void;
	}
}