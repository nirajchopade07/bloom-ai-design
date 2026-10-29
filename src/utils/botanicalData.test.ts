import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOTANICAL_COLLECTION,
  filterFloraByCategory,
  calculateEstimatedPolygonCount,
  formatStatValue,
  calculatePetalAngle,
  generateSeedCode
} from './botanicalData';

test('filterFloraByCategory returns all items when category is empty or "all"', () => {
  const all = filterFloraByCategory(BOTANICAL_COLLECTION, 'all');
  assert.equal(all.length, BOTANICAL_COLLECTION.length);

  const empty = filterFloraByCategory(BOTANICAL_COLLECTION, '');
  assert.equal(empty.length, BOTANICAL_COLLECTION.length);
});

test('filterFloraByCategory filters by category correctly', () => {
  const artistic = filterFloraByCategory(BOTANICAL_COLLECTION, 'artistic');
  assert.equal(artistic.length, 2);
  assert.ok(artistic.every(item => item.category === 'artistic'));

  const structures = filterFloraByCategory(BOTANICAL_COLLECTION, '3d-structure');
  assert.equal(structures.length, 2);
});

test('calculateEstimatedPolygonCount scales correctly', () => {
  assert.equal(calculateEstimatedPolygonCount(1000, 2), 2000);
  assert.equal(calculateEstimatedPolygonCount(1000, 1.5), 1500);
  assert.equal(calculateEstimatedPolygonCount(1000, -1), 0);
});

test('formatStatValue formats numbers into clean readable strings', () => {
  assert.equal(formatStatValue(500), '500');
  assert.equal(formatStatValue(1500), '1.5k');
  assert.equal(formatStatValue(245000), '245.0k');
  assert.equal(formatStatValue(2400000), '2.4M');
});

test('calculatePetalAngle returns valid rotations and scales based on bloomFactor', () => {
  const closed = calculatePetalAngle(0, 0, 8, 0);
  assert.equal(closed.rotationX, 0.1);
  assert.equal(closed.scale, 0.4);

  const opened = calculatePetalAngle(0, 0, 8, 1);
  assert.equal(opened.rotationX, 0.4);
  assert.equal(opened.scale, 1.0);
});

test('generateSeedCode produces a consistent structured string', () => {
  const code = generateSeedCode('Orchid', 94, 4);
  assert.ok(code.startsWith('ORC-'));
  assert.equal(code.split('-').length, 3);
});
