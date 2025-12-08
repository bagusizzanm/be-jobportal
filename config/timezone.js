import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

// Ambil default timezone dari .env
const DEFAULT_TZ = process.env.TZ || "Asia/Jakarta";

/**
 * Format single Date
 */
export const formatDate = (
  date,
  format = "DD-MM-YYYY HH:mm:ss",
  tz = DEFAULT_TZ
) => {
  if (!(date instanceof Date)) return date;
  return dayjs(date).tz(tz).format(format);
};

/**
 * Format semua Date di object/array (rekursif)
 */
export const formatDatesInObject = (
  obj,
  format = "DD-MM-YYYY HH:mm:ss",
  tz = DEFAULT_TZ
) => {
  if (!obj) return obj;

  if (obj instanceof Date) {
    return formatDate(obj, format, tz);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => formatDatesInObject(item, format, tz));
  }

  if (typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = formatDatesInObject(obj[key], format, tz);
    }
    return newObj;
  }

  return obj;
};

/**
 * Middleware untuk auto-format semua response JSON
 */
export function dateFormatterMiddleware(req, res, next) {
  const oldJson = res.json;
  res.json = function (data) {
    const transform = (obj) => {
      if (!obj) return obj;
      if (obj instanceof Date) return formatDate(obj);
      if (Array.isArray(obj)) return obj.map(transform);
      if (typeof obj === "object") {
        const newObj = {};
        for (let key in obj) {
          newObj[key] = transform(obj[key]);
        }
        return newObj;
      }
      return obj;
    };
    return oldJson.call(this, transform(data));
  };
  next();
}

export default dateFormatterMiddleware;
