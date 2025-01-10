export function formatDateToYYYYMMDD(date: string): string {
    if (!date) return '';
    const [month, day, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function formatDateToDDMMYYYY(date: any): string {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    if (date === null || isNaN(date.getTime())) return '';
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}