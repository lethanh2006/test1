import bieumaukhaibao from './bieumaukhaibao';
import chucvu from './chucvu';
import exception from './exception';
import instances from './instances';
import login from './login';
import nodes from './nodes';
import workflow from './workflow';

export default {
	...login,
	...workflow,
	...bieumaukhaibao,
	...chucvu,
	...exception,
	...instances,
	...nodes,
	'pages.trangchu.title': 'PHÂN HỆ QUẢN LÝ ĐÀO TẠO',
	'pages.trangchu.subtitle': 'HỆ THỐNG ĐẠI HỌC SỐ',
	'pages.gioithieu.title': 'GIỚI THIỆU',
	'pages.gioithieu.subtitle': 'HỆ THỐNG ĐẠI HỌC SỐ',
};
