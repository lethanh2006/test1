import dayjs from './dayjs';
import _ from 'lodash';
import { removeHtmlTags, urlRegex } from '@/utils/utils';
import React from 'react';
import { FormattedMessage } from 'umi';
import type { Rule } from 'antd/es/form';

const allCharacters =
	'a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹýếẾ';

// Hàm trợ giúp để xử lý message từ i18n
const getMessage = (id: string, values?: Record<string, string | number>): any => {
	return React.createElement(FormattedMessage, { id, values });
};

// Hàm tạo rules với message từ i18n
const createRules = () => {
	const rules = {
		json: [
			{
				validator: (__, value, callback) => {
					try {
						if (value) {
							JSON.parse(value);
						}
						callback();
					} catch {
						callback('');
					}
				},
				message: getMessage('global.validation.json.invalid'),
			},
		] as Rule[],

		arrNumber: (max: number, min: number): Rule[] => [
			{
				validator: (__, value, callback) => {
					let isArrNumber = true;
					if (value && value.length) {
						value.map((item: any) => {
							const isNumber = !isNaN(item) && !isNaN(parseFloat(item));
							if (isNumber !== true) isArrNumber = false;
						});
					}
					if (!isArrNumber) callback('');
					callback();
				},
				message: getMessage('global.validation.arrNumber.onlyNumbers'),
			},
			{
				validator: (__, value, callback) => {
					let isValidArrNumber = true;
					if (value && value.length) {
						value.map((item: any) => {
							if (parseFloat(item) > max) isValidArrNumber = false;
						});
					}
					if (!isValidArrNumber) callback('');
					callback();
				},
				message: getMessage('global.validation.arrNumber.max', { max: String(max) }),
			},
			{
				validator: (__, value, callback) => {
					let isValidArrNumber = true;
					if (value && value.length) {
						value.map((item: any) => {
							if (parseFloat(item) < min) isValidArrNumber = false;
						});
					}
					if (!isValidArrNumber) callback('');
					callback();
				},
				message: getMessage('global.validation.arrNumber.min', { min: String(min) }),
			},
		],

		dacbiet: [
			{
				pattern: new RegExp(`^[0-9${allCharacters} \n]+$`),
				message: getMessage('global.validation.dacbiet.noSpecialChars'),
			},
		] as Rule[],

		ten: [
			{
				max: 50,
				message: getMessage('global.validation.ten.max'),
			},
			{
				whitespace: true,
				message: getMessage('global.validation.ten.whitespace'),
			},
			{
				pattern: new RegExp(`^[${allCharacters} ]+$`),
				message: getMessage('global.validation.ten.onlyLetters'),
			},
		] as Rule[],

		text: [
			{
				whitespace: true,
				message: getMessage('global.validation.text.whitespace'),
			},
		] as Rule[],

		sotaikhoan: [
			{
				pattern: new RegExp('^[0-9-]+$'),
				message: getMessage('global.validation.sotaikhoan.onlyNumbers'),
			},
		] as Rule[],

		number: (max: number, min: number = 0, hasDecimal: boolean = true): Rule[] => [
			{
				pattern: hasDecimal ? new RegExp('^[0-9-.]+$') : new RegExp('^[0-9-]+$'),
				message: hasDecimal
					? getMessage('global.validation.number.onlyNumbers')
					: getMessage('global.validation.number.onlyIntegers'),
			},
			{
				validator: (__, value, callback) => {
					if (parseFloat(value) > max) callback('');
					callback();
				},
				message: getMessage('global.validation.number.max', { max: String(max) }),
			},
			{
				validator: (__, value, callback) => {
					if (parseFloat(value) < min) callback('');
					callback();
				},
				message: getMessage('global.validation.number.min', { min: String(min) }),
			},
		],

		diem: [
			{
				validator: (__, value, callback) => {
					if (!Number.isInteger(value / 0.5)) callback('');
					callback();
				},
				message: getMessage('global.validation.diem.onlyHalf'),
			},
		] as Rule[],

		diemToeic: [
			{
				validator: (__, value, callback) => {
					if (!Number.isInteger(value / 5)) callback('');
					callback();
				},
				message: getMessage('global.validation.diemToeic.divisibleBy5'),
			},
		] as Rule[],

		email: [
			{
				pattern: new RegExp(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				),
				message: getMessage('global.validation.email.invalid'),
			},
		] as Rule[],

		httpLink: [
			{
				pattern: new RegExp(urlRegex),
				message: getMessage('global.validation.httpLink.invalid'),
			},
		] as Rule[],

		soDienThoai: [
			{
				pattern: new RegExp(/(^(09|03|07|08|05|01|02|04|06){1}[0-9]{8}$){1}/g),
				message: getMessage('global.validation.soDienThoai.invalid'),
			},
		] as Rule[],

		ngaySinh: [
			{
				validator: (__, value, callback) => {
					if (dayjs(value).isAfter(dayjs())) callback('');
					callback();
				},
				message: getMessage('global.validation.ngaySinh.invalid'),
			},
		] as Rule[],

		sauHomNay: [
			{
				validator: (__, value, callback) => {
					if (value && dayjs(value).isBefore(dayjs().startOf('day'))) callback('');
					callback();
				},
				message: getMessage('global.validation.sauHomNay.beforeNow'),
			},
		] as Rule[],

		sauThoiDiem: (mo: any, label: string): Rule[] => [
			{
				validator: (__, value, callback) => {
					if (mo && value && dayjs(value).isBefore(dayjs(mo))) callback('');
					callback();
				},
				message: getMessage('global.validation.sauThoiDiem.before', { label }),
			},
		],

		sauNgay: (mo: any, label: string): Rule[] => [
			{
				validator: (__, value, callback) => {
					if (mo && value && dayjs(value).isBefore(dayjs(mo).startOf('day'))) callback('');
					callback();
				},
				message: getMessage('global.validation.sauNgay.before', { label }),
			},
		],

		truocHomNay: [
			{
				validator: (__, value, callback) => {
					if (value && dayjs(value).isAfter(dayjs().startOf('day'))) callback('');
					callback();
				},
				message: getMessage('global.validation.truocHomNay.afterNow'),
			},
		] as Rule[],

		truocThoiDiem: (mo: any, label: string): Rule[] => [
			{
				validator: (__, value, callback) => {
					if (mo && value && dayjs(value).isAfter(dayjs(mo))) callback('');
					callback();
				},
				message: getMessage('global.validation.truocThoiDiem.after', { label }),
			},
		],

		truocNgay: (mo: any, label: string): Rule[] => [
			{
				validator: (__, value, callback) => {
					if (mo && value && dayjs(value).isAfter(dayjs(mo).startOf('day'))) callback('');
					callback();
				},
				message: getMessage('global.validation.truocNgay.after', { label }),
			},
		],

		required: [
			{
				required: true,
				message: getMessage('global.validation.required'),
			},
		] as Rule[],

		requiredHtml: [
			{
				validator: (__, value, callback) => {
					if (
						removeHtmlTags(value.text) === '' &&
						!value.text.includes('<img') &&
						!value.text.includes('<video') &&
						!value.text.includes('<iframe')
					)
						callback('');

					callback();
				},
				message: getMessage('global.validation.requiredHtml.whitespace'),
			},
			{
				required: true,
				message: getMessage('global.validation.required'),
			},
		] as Rule[],

		username: [
			{
				pattern: new RegExp('^[a-zA-Z0-9._]{4,32}$'),
				message: getMessage('global.validation.username.format'),
			},
		] as Rule[],

		password: [
			{
				pattern: new RegExp('^[0-9a-zA-Z~!@#$%^&*(_)+/<>?}{:;",.=|]{4,}$'),
				message: getMessage('global.validation.password.format'),
			},
		] as Rule[],

		CMND: [
			{
				pattern: new RegExp('^[0-9]{9}$|^[0-9]{12}$'),
				message: getMessage('global.validation.CMND.format'),
			},
		] as Rule[],

		length: (len: number): Rule[] => [
			{
				max: len,
				message: getMessage('global.validation.length.max', { len: String(len) }),
			},
		],

		fixKiTu: (len: number): Rule[] => [
			{
				max: len,
				min: len,
				message: getMessage('global.validation.fixKiTu.exact', { len: String(len) }),
			},
		],

		fileRequired: [
			{
				validator: (__, value, callback) => {
					if (_.get(value, 'fileList', []).length === 0) callback('');
					callback();
				},
				required: true,
				message: getMessage('global.validation.fileRequired.required'),
			},
		] as Rule[],

		fileName: [
			{
				validator: (__, value, callback) => {
					const re = new RegExp(
						'^[ 0-9a-z_\\-aàáạảãâầấậẩẫăằắặẳẵeèéẹẻẽêềếệểễiìíịỉĩoòóọỏõôồốộổỗơờớợởỡuùúụủũưừứựửữyỳýỵỷỹdđ]{1,100}$',
					);
	
					value?.fileList?.map((item: any) => {
						if (!re.test(item?.name?.split('.')?.[0])) callback('');
					});
					callback();
				},
				message: getMessage('global.validation.fileName.format'),
			},
		] as Rule[],

		fileType: (arrType: string[]): Rule[] => [
			{
				validator: (__, value, callback) => {
					value?.fileList?.map((item: any) => {
						const type = item?.name?.split('.')?.pop();
						if (!arrType?.includes(type)) callback('');
					});
					callback();
				},
				message: getMessage('global.validation.fileType.allowed', { types: arrType?.join(', ') }),
			},
		],

		fileLimit: (len: number): Rule[] => [
			{
				validator: (__, value, callback) => {
					if (_.get(value, 'fileList', []).length > len) callback('');
					callback();
				},
				message: getMessage('global.validation.fileLimit.max', { len: String(len) }),
			},
		],

		floatnumber: (max: number, min: number = 0, sauDauPhay: number = 2): Rule[] => [
			{
				pattern: new RegExp(/^-?\d*(\.\d+)?$/),
				message: getMessage('global.validation.floatnumber.onlyNumbers'),
			},
			{
				validator: (__, value, callback) => {
					const string = `${value}`.split('.');
					if (string.length === 2 && string[1].length > sauDauPhay) callback('');
					callback();
				},
				message: getMessage('global.validation.floatnumber.decimalPlaces', { sauDauPhay: String(sauDauPhay) }),
			},
			{
				validator: (__, value, callback) => {
					if (value > max) callback('');
					callback();
				},
				message: getMessage('global.validation.floatnumber.max', { max: String(max) }),
			},
			{
				validator: (__, value, callback) => {
					if (value < min) callback('');
					callback();
				},
				message: getMessage('global.validation.floatnumber.min', { min: String(min) }),
			},
		],

		float: (max: number, min: number = 0, sauDauPhay: number = 2): Rule[] => [
			{
				pattern: new RegExp('^[0-9.]+$'),
				message: getMessage('global.validation.float.onlyNumbersOrDot'),
			},
			{
				validator: (__, value, callback) => {
					if (!max) {
						callback();
						return;
					}
					if (max && parseFloat(value) > max) callback('');
					callback();
				},
				message: getMessage('global.validation.float.max', { max: String(max) }),
			},
			{
				validator: (__, value, callback) => {
					if (parseFloat(value) < min) callback('');
					callback();
				},
				message: getMessage('global.validation.float.min', { min: String(min) }),
			},
			{
				validator: (__, value, callback) => {
					const string = `${value}`.split('.');
					if (string.length === 2 && string[1].length > sauDauPhay) callback('');
					callback();
				},
				message: getMessage('global.validation.float.decimalPlaces', { sauDauPhay: String(sauDauPhay) }),
			},
		],

		notEqual: (text: any, label?: string): Rule[] => [
			{
				validator: (__, value, callback) => {
					if (value === text) callback('');
					callback();
				},
				message: getMessage('global.validation.notEqual', { label: label ?? String(text) }),
			},
		],
	};

	return rules;
};

const rules = createRules();

export default rules;
