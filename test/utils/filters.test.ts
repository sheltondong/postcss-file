import 'jest';
import { ShouldHandleOptions, shouldHandle } from '../../src/utils/filters';

/**
 * Just test include option
 */
describe('Test single include', () => {
	test('test default', () => {
		const options: ShouldHandleOptions = {
			file: 'src/index.png',
		};
		expect(shouldHandle(options)).toBe(true);
	});

	test('test not included', () => {
		const options: ShouldHandleOptions = {
			include: ['util'],
			file: 'src/index.png',
		};
		expect(shouldHandle(options)).toBe(false);
	});

	test('test be included', () => {
		const options: ShouldHandleOptions = {
			include: ['src'],
			file: 'src/index.png',
		};
		expect(shouldHandle(options)).toBe(true);
	});

	test('test implict included', () => {
		const options1: ShouldHandleOptions = {
			include: ['./src/**/*.png'],
			file: 'src/index.png',
		};
		expect(shouldHandle(options1)).toBe(false);

		const options2: ShouldHandleOptions = {
			include: ['src/**/*.png'],
			file: './src/whatever/index.png',
		};
		expect(shouldHandle(options2)).toBe(true);
	});
});

/**
 * Just test exclude option
 */
describe('Test single exclude', () => {
	test('test not excluded', () => {
		const options = {
			file: './src/test.jpg'
		};
		expect(shouldHandle(options)).toBe(true);
	});

	test('test not excluded', () => {
		const options = {
			exclude: ['node_modules'],
			file: './src/test.jpg'
		};
		expect(shouldHandle(options)).toBe(true);
	});

	test('test be excluded', () => {
		const options1 = {
			exclude: ['node_modules'],
			file: './node_modules/test.jpg'
		};
		expect(shouldHandle(options1)).toBe(false);

		const options2 = {
			exclude: ['node_modules'],
			file: './node_modules/whatever/test.jpg'
		};
		expect(shouldHandle(options2)).toBe(false);
	});

	test('test implict excluded', () => {
		const options = {
			exclude: ['node_modules/**/*.jpg'],
			file: './node_modules/whatever/wherever/test.jpg'
		};
		expect(shouldHandle(options)).toBe(false);
	});
});

/**
 * Just test extensions option
 */
describe('Test single etxs', () => {
	test('test match ext', () => {
		const options = {
			extensions: ['.jpg', '.png'],
			file: './src/modules/test.jpg'
		};
		expect(shouldHandle(options)).toBe(true);
	});

	test('test not match ext', () => {
		const options = {
			extensions: ['.jpg', '.png'],
			file: './src/modules/test.gif'
		};
		expect(shouldHandle(options)).toBe(false);
	});
});

/**
 * Test filter with all options
 */
describe('Intergration test', () => {
	test('Intergrational matchd', () => {
		const options = {
			include: ['src'],
			exclude: ['node_modules'],
			extensions: ['.jpg', '.png'],
			file: './src/modules/test.jpg'
		};
		expect(shouldHandle(options)).toBe(true);
	});

	test('Intergrational unmatchd', () => {
		const options = {
			include: ['src'],
			exclude: ['node_modules', 'test'],
			extensions: ['.jpg', '.png'],
			file: './test/modules/test.jpg'
		};
		expect(shouldHandle(options)).toBe(false);
	});

	test('Intergrational subfolder', () => {
		const options = {
			include: ['src'],
			exclude: ['node_modules', 'src/test'],
			extensions: ['.jpg', '.png'],
			file: './src/test/modules/test.jpg'
		};
		expect(shouldHandle(options)).toBe(false);
	});
});
