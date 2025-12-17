import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {calculateChecksum, getServicesFromDOM} from "../../../src/core/consent/serviceScanner";


describe('serviceScanner', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('getServicesFromDOM', () => {
        it('should return empty object when no scripts', () => {
            const result = getServicesFromDOM();
            expect(result).toEqual({});
        });

        it('should scan scripts with data-service attribute', () => {
            document.body.innerHTML = `
        <script type="text/plain" data-cookie-category="analytics" data-service="google"></script>
        <script type="text/plain" data-cookie-category="analytics" data-service="clarity"></script>
      `;

            const result = getServicesFromDOM();
            expect(result.analytics).toEqual(['clarity', 'google']); // sorted
        });

        it('should ignore scripts without data-service', () => {
            document.body.innerHTML = `
        <script type="text/plain" data-cookie-category="analytics"></script>
      `;

            const result = getServicesFromDOM();
            expect(result).toEqual({});
        });

        it('should sort services alphabetically', () => {
            document.body.innerHTML = `
        <script type="text/plain" data-cookie-category="ads" data-service="z"></script>
        <script type="text/plain" data-cookie-category="ads" data-service="a"></script>
        <script type="text/plain" data-cookie-category="ads" data-service="m"></script>
      `;

            const result = getServicesFromDOM();
            expect(result.ads).toEqual(['a', 'm', 'z']);
        });

        it('should deduplicate services', () => {
            document.body.innerHTML = `
        <script type="text/plain" data-cookie-category="analytics" data-service="google"></script>
        <script type="text/plain" data-cookie-category="analytics" data-service="google"></script>
      `;

            const result = getServicesFromDOM();
            expect(result.analytics).toEqual(['google']);
        });

        it('should handle multiple categories', () => {
            document.body.innerHTML = `
        <script type="text/plain" data-cookie-category="analytics" data-service="google"></script>
        <script type="text/plain" data-cookie-category="ads" data-service="facebook"></script>
        <script type="text/plain" data-cookie-category="analytics" data-service="clarity"></script>
      `;

            const result = getServicesFromDOM();
            expect(result.analytics).toEqual(['clarity', 'google']);
            expect(result.ads).toEqual(['facebook']);
        });
    });

    describe('calculateChecksum', () => {
        it('should return same hash for same services', () => {
            const hash1 = calculateChecksum(['google', 'clarity']);
            const hash2 = calculateChecksum(['google', 'clarity']);
            expect(hash1).toBe(hash2);
        });

        it('should return different hash for different services', () => {
            const hash1 = calculateChecksum(['google']);
            const hash2 = calculateChecksum(['clarity']);
            expect(hash1).not.toBe(hash2);
        });

        it('should be order-independent', () => {
            const hash1 = calculateChecksum(['a', 'b', 'c']);
            const hash2 = calculateChecksum(['c', 'b', 'a']);
            expect(hash1).toBe(hash2);
        });

        it('should handle empty array', () => {
            const hash = calculateChecksum([]);
            expect(hash).toBeDefined();
            expect(typeof hash).toBe('string');
            expect(hash.length).toBeGreaterThan(0);
        });

        it('should return consistent hash format', () => {
            const hash = calculateChecksum(['test']);
            expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
        });
    });
});
