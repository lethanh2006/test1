import global from './en-US/global';
import menu from './en-US/menu';
import modules from './en-US/modules';
import pages from './en-US/pages';

export default {
	'app.copyright.produced': 'Developed by A.I-SOFT',
	'app.locale.image': 'en-US.svg',
	'app.locale.title': 'English',
	...menu,
	...pages,
	...global,
	...modules
};
