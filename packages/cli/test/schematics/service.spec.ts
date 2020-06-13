import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { join } from 'path';

describe('Service', () => {
  let schematicTestRunner: SchematicTestRunner;

  beforeAll(() => {
    schematicTestRunner = new SchematicTestRunner('schematics', join(process.cwd(), 'schematics.json'));
  });

  describe('name option', () => {
    it('should throw error without name option', async () => {
      await expect(schematicTestRunner.runSchematicAsync('service', {}, Tree.empty()).toPromise()).rejects.toThrowError();
    });

    it('should return correct tree with name option', async () => {
      const tree = await schematicTestRunner.runSchematicAsync('service', { name: 'foo' }, Tree.empty()).toPromise();

      expect(tree.files).toEqual([
        '/foo/foo.service.spec.ts',
        '/foo/foo.service.ts',
      ]);
    });

    it('should return correct tree with nested name option', async () => {
      const tree = await schematicTestRunner.runSchematicAsync('service', { name: 'foo/bar' }, Tree.empty()).toPromise();

      expect(tree.files).toEqual([
        '/foo/bar/bar.service.spec.ts',
        '/foo/bar/bar.service.ts',
      ]);
    });
  });

  describe('skipTests option', () => {
    it('should return correct tree without skipTests option', async () => {
      const tree = await schematicTestRunner.runSchematicAsync('service', { name: 'foo' }, Tree.empty()).toPromise();

      expect(tree.files).toEqual([
        '/foo/foo.service.spec.ts',
        '/foo/foo.service.ts',
      ]);
    });

    it('should return correct tree with skipTests option set as false', async () => {
      const tree = await schematicTestRunner.runSchematicAsync('service', { name: 'foo', skipTests: false }, Tree.empty()).toPromise();

      expect(tree.files).toEqual([
        '/foo/foo.service.spec.ts',
        '/foo/foo.service.ts',
      ]);
    });

    it('should return correct tree with skipTests option set as true', async () => {
      const tree = await schematicTestRunner.runSchematicAsync('service', { name: 'foo', skipTests: true }, Tree.empty()).toPromise();

      expect(tree.files).toEqual([
        '/foo/foo.service.ts',
      ]);
    });
  });
});
