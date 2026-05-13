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
	'pages.trangchu.title': 'TRAINING MANAGEMENT SUBSYSTEM',
	'pages.trangchu.subtitle': 'DIGITAL UNIVERSITY SYSTEM',
	'pages.gioithieu.title': 'ABOUT',
	'pages.gioithieu.subtitle': 'DIGITAL UNIVERSITY SYSTEM',
};
