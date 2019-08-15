import * as moment from 'moment';

export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_EN_FORMAT = 'YYYY-MM-DD';
export const DATE_ISO_FORMAT = 'YYYY-MM-DD hh:mm:ss';

export const currentDate = () => moment().format(DATE_FORMAT);
export const currentDateEn = () => moment().format(DATE_EN_FORMAT);
export const currentDateIso = () => moment().format(DATE_ISO_FORMAT);

export const convertDateEn = (date) => moment(date, DATE_EN_FORMAT).format(DATE_FORMAT);
