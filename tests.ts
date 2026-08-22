import assert from 'node:assert';
import { buildCareerProfile } from './src/utils/profileAggregator';
import { matchCareers } from './src/utils/careerMatchingEngine';

console.log('Running tests...');

// 1. profileAggregator tests
const results = [
  { quiz_id: 'riasec', answers: {}, created_at: '2023-01-01T10:00:00Z' },
  { quiz_id: 'riasec', answers: { q1: '5' }, created_at: '2023-01-02T10:00:00Z' }, // This should win
  { quiz_id: 'ability', answers: { q1: '3' }, created_at: '2023-01-01T12:00:00Z' }
];

const profile = buildCareerProfile(results);

assert.strictEqual(profile.completedTests.includes('riasec'), true, 'Should include riasec');
assert.strictEqual(profile.completedTests.includes('ability'), true, 'Should include ability');
assert.strictEqual(profile.completeness, 50, 'Should have 50 completeness for 2 tests');

// Duplicate quiz type, latest result wins
assert.ok(profile.riasec !== undefined, 'Should have riasec profile calculated');

// 2. careerMatchingEngine tests
const matches = matchCareers(profile);

// Only RIASEC and Ability are available, so weights should be dynamically normalized
// effective weights: RIASEC (30), Ability (30) -> totalWeight = 60
assert.ok(matches.length > 0, 'Should find matches');

const topMatch = matches[0];
assert.ok(topMatch.score > 0, 'Score should be calculated');
assert.deepStrictEqual(topMatch.availableDimensions.sort(), ['riasec', 'ability'].sort(), 'Should identify available dimensions');
assert.deepStrictEqual(topMatch.missingDimensions.sort(), ['personality', 'workValues'].sort(), 'Should identify missing dimensions');
assert.strictEqual(topMatch.completeness, 50, 'Completeness should be mapped');

console.log('All tests passed successfully!');
