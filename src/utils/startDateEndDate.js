export function parseStartEndDate(dateRange) {
    // Example inputs: "Sep 2002 - Jun 2006", "2002 - 2006"
    if (!dateRange) return { startDate: '', endDate: '' };

    const [start, end] = dateRange.split('-').map(s => s.trim());


    // Try to parse as "Month Year"
    const parse = (str, isEnd = false) => {
        if (isEnd && /present/i.test(str)) {
            return 'Present';
        }
        // If end date contains '·', keep only the part before it (e.g., 'Aug 2019 · 1 yr' -> 'Aug 2019')
        if (isEnd && str.includes('·')) {
            str = str.split('·')[0].trim();
        }
        // If only year, return as is
        if (/^\d{4}$/.test(str)) return str;
        // If "Mon YYYY", convert to "Mon YYYY" (e.g., "Sep 2002")
        const d = new Date(str);
        if (!isNaN(d)) {
            const year = d.getFullYear();
            const month = d.toLocaleString('en-US', { month: 'short' });
            return `${month} ${year}`;
        }
        return str;
    };

    return {
        startDate: parse(start),
        endDate: parse(end, true)
    };
}