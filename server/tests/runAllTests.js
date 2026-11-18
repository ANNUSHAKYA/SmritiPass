// ============================================================
// Smriti Pass — Master Automated Test Runner
// Runs all Phase 2, Phase 3, Phase 4, and Phase 10 test suites
// ============================================================
const { runRevenueModelTests } = require('./revenueModel.test');
const { runLifecycleAndSecurityTests } = require('./lifecycleAndSecurity.test');
const { runAiTests } = require('./ai.test');

console.log('========================================================');
console.log('🏛️  SMRITI PASS 2.0 — MASTER AUTOMATED TEST SUITE');
console.log('Agra Pilot Production Readiness Verification');
console.log('========================================================');

const startTime = Date.now();

const suite1 = runRevenueModelTests();
const suite2 = runLifecycleAndSecurityTests();
const suite3 = runAiTests();

const totalPassed = suite1.passed + suite2.passed + suite3.passed;
const totalFailed = suite1.failed + suite2.failed + suite3.failed;
const durationMs = Date.now() - startTime;

console.log('========================================================');
console.log(`TOTAL TESTS RUN: ${totalPassed + totalFailed}`);
console.log(`PASSED: ${totalPassed}`);
console.log(`FAILED: ${totalFailed}`);
console.log(`EXECUTION TIME: ${durationMs}ms`);
console.log('========================================================');

if (totalFailed > 0) {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL TESTS PASSED SUCCESSFULLY (100% PASS RATE)');
  process.exit(0);
}
