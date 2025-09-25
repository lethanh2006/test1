import { Popover, PopoverProps } from 'antd';
import classNames from 'classnames';
import React from 'react';
import styles from './index.less';

export type HeaderDropdownProps = {
	overlayClassName?: string;
} & PopoverProps;

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, ...restProps }) => (
	<Popover
		classNames={{ body: classNames(styles.dropdown_container, cls) }}
		arrow
		trigger='click'
		styles={{ body: { padding: 0 } }}
		{...restProps}
	/>
);

export default HeaderDropdown;
