import dayjs from "dayjs";

export const formatDateTime = (date) => {
    return dayjs(date).format("DD MMMM, YYYY HH:mm A");
};
export const formatDateAndTime = (startDate, startTime) => {
    const combinedDateTime = dayjs(startDate).hour(dayjs(startTime).hour()).minute(dayjs(startTime).minute());
    return combinedDateTime.format("DD MMMM, YYYY HH:mm A");
};

export const formatDateAndTimePoint = (startDate, startTime) => {
    const combinedDateTime = dayjs(startDate).hour(dayjs(startTime).hour()).minute(dayjs(startTime).minute());
    return combinedDateTime.format("DD MMMM, YYYY HH:mm");
};

export const getDayFromDate = (date) => {
    const d = new Date(date);
    return d.getDate();
};
export const getMonthFromDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', { month: 'short' });
};