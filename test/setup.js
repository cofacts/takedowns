import { jest } from '@jest/globals';
import 'dotenv/config';

jest.setTimeout(process.env.JEST_TIMEOUT || 30000);
