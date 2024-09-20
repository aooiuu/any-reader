// @vitest-environment jsdom

import { createAnalyzerManager } from '../../src/browser';
import runTest from '../analyzer';

runTest(createAnalyzerManager());
