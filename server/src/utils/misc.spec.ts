import { describe, expect, it } from 'vitest';
import { createLibraryMatcher, getKeysDeep, unsetDeep } from 'src/utils/misc.js';

describe('getKeysDeep', () => {
  it('should handle an empty object', () => {
    expect(getKeysDeep({})).toEqual([]);
  });

  it('should list properties', () => {
    expect(
      getKeysDeep({
        foo: 'bar',
        flag: true,
        count: 42,
        date: new Date(),
      }),
    ).toEqual(['foo', 'flag', 'count', 'date']);
  });

  it('should skip undefined properties', () => {
    expect(getKeysDeep({ foo: 'bar', hello: undefined })).toEqual(['foo']);
  });

  it('should skip array indices', () => {
    expect(getKeysDeep({ foo: 'bar', hello: ['foo', 'bar'] })).toEqual(['foo', 'hello']);
    expect(getKeysDeep({ foo: 'bar', nested: { hello: ['foo', 'bar'] } })).toEqual(['foo', 'nested.hello']);
  });

  it('should list nested properties', () => {
    expect(getKeysDeep({ foo: 'bar', hello: { world: true } })).toEqual(['foo', 'hello.world']);
  });
});

describe('unsetDeep', () => {
  it('should remove a property', () => {
    expect(unsetDeep({ hello: 'world', foo: 'bar' }, 'foo')).toEqual({ hello: 'world' });
  });

  it('should remove the last property', () => {
    expect(unsetDeep({ foo: 'bar' }, 'foo')).toBeUndefined();
  });

  it('should remove a nested property', () => {
    expect(unsetDeep({ foo: 'bar', nested: { enabled: true, count: 42 } }, 'nested.enabled')).toEqual({
      foo: 'bar',
      nested: { count: 42 },
    });
  });

  it('should clean up an empty property', () => {
    expect(unsetDeep({ foo: 'bar', nested: { enabled: true } }, 'nested.enabled')).toEqual({ foo: 'bar' });
  });
});

describe('createLibraryMatcher', () => {
  it.each([
    { path: '/photos/a.jpg', importPaths: ['/photos/'], isInLibrary: true },
    { path: '/other/a.jpg', importPaths: ['/photos/'], isInLibrary: false },
    { path: '/other/a.jpg', importPaths: ['/photos/', '/other/'], isInLibrary: true },
    // unlike SQL `LIKE`, `_` and `%` are literal
    { path: '/photosX2020/a.jpg', importPaths: ['/photos_2020/'], isInLibrary: false },
    { path: '/photos/2020/a.jpg', importPaths: ['/photos%/'], isInLibrary: false },
  ])(
    'should report $path as in library: $isInLibrary, with import paths $importPaths',
    ({ path, importPaths, isInLibrary }) => {
      expect(createLibraryMatcher({ importPaths, exclusionPatterns: [] })(path)).toBe(isInLibrary);
    },
  );

  it.each([
    { pattern: '**/Raw/**', path: '/photos/Raw/bar.jpg', isInLibrary: false },
    { pattern: '**/Raw/**', path: '/photos/bar.jpg', isInLibrary: true },
    { pattern: '**/raw/**', path: '/photos/RAW/bar.jpg', isInLibrary: false },
    { pattern: '**/abc/*.tif', path: '/photos/abc/scan.tif', isInLibrary: false },
    { pattern: '**/abc/*.tif', path: '/photos/abc/sub/scan.tif', isInLibrary: true },
    { pattern: '**/*.jp?', path: '/photos/bar.jpg', isInLibrary: false },
    { pattern: '**/*.ARW', path: '/photos/bar.arw', isInLibrary: false },
    { pattern: '**/@eaDir/**', path: '/photos/@eaDir/thumb.jpg', isInLibrary: false },
    { pattern: '**/._*', path: '/photos/._resource', isInLibrary: false },
    // a bare `*` must not cross a path separator
    { pattern: '/photos/*.*', path: '/photos/photo.jpg', isInLibrary: false },
    { pattern: '/photos/*.*', path: '/photos/2020/photo.jpg', isInLibrary: true },
    // Postgres regexes disagreed with picomatch on these, or rejected them
    { pattern: '**/İstanbul/**', path: '/photos/istanbul/a.jpg', isInLibrary: true },
    { pattern: '**/ΚΎΠΡΟΣ/**', path: '/photos/Κύπρος/a.jpg', isInLibrary: false },
    { pattern: String.raw`**/a\y/**`, path: '/photos/a/b.jpg', isInLibrary: true },
    { pattern: String.raw`**/a\k/**`, path: '/photos/ak/b.jpg', isInLibrary: false },
  ])(
    'should report $path as in library: $isInLibrary, with exclusion pattern $pattern',
    ({ pattern, path, isInLibrary }) => {
      expect(createLibraryMatcher({ importPaths: ['/photos/'], exclusionPatterns: [pattern] })(path)).toBe(isInLibrary);
    },
  );
});
