import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // chỉ cần import 1 lần
import advancedFormat from 'dayjs/plugin/advancedFormat';
import calendar from 'dayjs/plugin/calendar';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';

// mirgrate from moment to dayjs:

// tmp =
//   moment(content, 'DD/MM/YYYY').toISOString() ||
//   moment(content, 'D/M/YYYY').toISOString() ||
//   moment.unix((Number.parseInt(content) - 25569) * 86400).toISOString() ||
//   moment(content).toISOString() ||
//   invalidText;

// Tuy nhiên, khi chuyển sang dayjs, không thể viết ngắn gọn kiểu đó vì dayjs(...).toISOString() sẽ trả về Invalid Date string thay vì undefined khi không hợp lệ, nên || không hoạt động đúng như mong đợi.
// let parsedDate: string;

// if (dayjs(content, 'DD/MM/YYYY', true).isValid()) {
// 	parsedDate = dayjs(content, 'DD/MM/YYYY').toISOString();
// } else if (dayjs(content, 'D/M/YYYY', true).isValid()) {
// 	parsedDate = dayjs(content, 'D/M/YYYY').toISOString();
// } else if (!isNaN(Number(content))) {
// 	// Excel serial date → Unix timestamp
// 	parsedDate = dayjs.unix((Number(content) - 25569) * 86400).toISOString();
// } else if (dayjs(content).isValid()) {
// 	parsedDate = dayjs(content).toISOString();
// } else {
// 	parsedDate = invalidText;
// }

// // Moment
// const nextWeek = startDate.clone().add(7, 'day');

// // Dayjs
// const nextWeek = startDate.add(7, 'day'); // không cần clone

// // Moment
// moment().isBefore(record?.thoiGianBatDau);

// // Dayjs
// dayjs().isBefore(dayjs(record?.thoiGianBatDau)); // ✅ cần bọc nếu là string

// Extend plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(minMax);
dayjs.extend(duration);
dayjs.extend(calendar);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

// Set locale + timezone
dayjs.locale('vi');
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

export default dayjs;
