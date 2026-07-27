const assert = require('node:assert/strict');
const test = require('node:test');

const {
    companyCounts,
    filterEvents,
    getDataDate,
    segmentCounts
} = require('../lib/transforms.js');

test('empty events preserve the transform semantics', () => {
    const dataDate = getDataDate([]);

    assert.ok(Number.isNaN(dataDate.getTime()));
    assert.deepStrictEqual(filterEvents([], {
        days: 'all',
        company: 'all',
        type: 'all',
        segment: 'all'
    }, new Date()), []);
    assert.deepStrictEqual(companyCounts([]), {});
    assert.deepStrictEqual(segmentCounts([], []), {});
});

test('companyCounts splits comma-separated companies', () => {
    assert.deepStrictEqual(companyCounts([
        { company: 'Acme, Beta' },
        { company: 'Acme' }
    ]), {
        Acme: 2,
        Beta: 1
    });
});

test('filterEvents matches companies with includes', () => {
    const events = [
        { published: '2024-01-10', company: 'Acme, Beta', event_type: 'Funding', segment: 'infra' },
        { published: '2024-01-10', company: 'Gamma', event_type: 'Funding', segment: 'infra' }
    ];

    assert.deepStrictEqual(filterEvents(events, {
        days: 'all',
        company: 'Beta',
        type: 'all',
        segment: 'all'
    }, new Date('2024-01-10T00:00:00Z')), [events[0]]);
});

test('filterEvents includes events exactly at the days boundary', () => {
    const events = [
        { published: '2024-01-08', company: 'Acme', event_type: 'Funding', segment: 'infra' },
        { published: '2024-01-07', company: 'Acme', event_type: 'Funding', segment: 'infra' }
    ];

    assert.deepStrictEqual(filterEvents(events, {
        days: '2',
        company: 'all',
        type: 'all',
        segment: 'all'
    }, new Date('2024-01-10T00:00:00Z')), [events[0]]);
});

test('segmentCounts falls back to unknown segment ids', () => {
    assert.deepStrictEqual(segmentCounts([
        { segment: 'known' },
        { segment: 'unknown' }
    ], [{ id: 'known', label: 'Known' }]), {
        Known: 1,
        unknown: 1
    });
});
