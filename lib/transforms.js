function getDataDate(events) {
    return new Date(Math.max(...events.map(e => new Date(e.published + 'T00:00:00'))));
}

function filterEvents(events, { days, company, type, segment }, now) {
    return events.filter(e => {
        if (days !== 'all') {
            const d = new Date(e.published);
            if ((now - d) / 86400000 > parseInt(days)) return false;
        }
        if (company !== 'all' && !e.company.includes(company)) return false;
        if (type !== 'all' && e.event_type !== type) return false;
        if (segment !== 'all' && e.segment !== segment) return false;
        return true;
    });
}

function companyCounts(events) {
    const counts = {};
    events.forEach(e => {
        e.company.split(', ').forEach(company => {
            counts[company] = (counts[company] || 0) + 1;
        });
    });
    return counts;
}

function segmentCounts(events, segments) {
    const counts = {};
    events.forEach(e => {
        const segment = segments.find(s => s.id === e.segment);
        const label = segment ? segment.label : e.segment;
        counts[label] = (counts[label] || 0) + 1;
    });
    return counts;
}

const Transforms = { getDataDate, filterEvents, companyCounts, segmentCounts };

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Transforms;
} else {
    window.Transforms = Transforms;
}
