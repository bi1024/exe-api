import { addMonths, addWeeks, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";

// yyyy-MM-dd
export function getCurrentWeek() : { start: string, end: string } {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    return {
        start: format(startOfCurrentWeek, 'yyyy-MM-dd'),
        end: format(endOfCurrentWeek, 'yyyy-MM-dd')
    }
}

export function getNextWeeks(numberOfWeeks: number) : { start: string, end: string} {
    if(numberOfWeeks === 0) return getCurrentWeek();
    const today = new Date();
    const start = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
    const end = endOfWeek(addWeeks(today, numberOfWeeks), { weekStartsOn: 1 });
    return {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
    }
}

export function getCurrentMonth() : { start: string, end: string } {
    const today = new Date();
    return {
        start: format(startOfMonth(today), 'yyyy-MM-dd'),
        end: format(endOfMonth(today), 'yyyy-MM-dd')
    }
}

export function getNextMonths(numberOfMonths: number) : { start: string, end: string} {
    if(numberOfMonths === 0) return getCurrentMonth();
    const today = new Date();
    const start = startOfMonth(addMonths(today, 1));
    const end = endOfMonth(addMonths(today, numberOfMonths));
    return {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
    }
}