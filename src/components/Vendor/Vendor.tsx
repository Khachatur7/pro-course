import { VendorProps } from "./Vendor.props";
import styles from "./Vendor.module.css";
import cn from "classnames";


function Vendor({ children, className, ...props }: VendorProps) {
	return (
		<div {...props} className={cn(styles['vendor'], className)}>
			<div className={styles['vendor-info']}>
				{children}
			</div>
		</div>
	)
}

export default Vendor;