import 'jest';
import * as path from 'path';
import * as crypto from 'crypto';
import { Buffer } from 'buffer';

const mockReadFileSync = jest.fn();
const mockExistsSync = jest.fn();
const mockWriteSync = jest.fn();
const mockMkdirpSync = jest.fn();

describe('Test default', () => {
	beforeAll(() => {
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	jest.mock('fs', () => {
		return {
			readFileSync: mockReadFileSync,
			existsSync: mockExistsSync,
			writeFileSync: mockWriteSync,
		};
	});

	test('test no url option', () => {
		const { handleAsset } = require('../../src/utils/urlHandler');

		const options = {
			importer: './src/index.css',
			file: './src/test.png',
		};
		const buffer = new Buffer('hello');
		mockReadFileSync.mockReturnValue(buffer);
		mockExistsSync.mockReturnValue(true);
		expect(handleAsset(options)).toBe(options.file);
	});
});

describe('Test copy option', () => {
	beforeAll(() => {
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	jest.mock('fs', () => {
		return {
			readFileSync: mockReadFileSync,
			existsSync: mockExistsSync,
			writeFileSync: mockWriteSync,
		};
	});

	jest.mock('mkdirp', () => {
		return {
			sync: mockMkdirpSync
		};
	});

	test('test no hash and publicPath', () => {
		const { handleAsset } = require('../../src/utils/urlHandler');

		const options = {
			assetsPath: 'lib/assets',
			importer: './src/index.css',
			file: './test.png',
			url: 'copy',
		};

		const buffer = new Buffer('hello');
		const filename = path.basename(options.file);
		const filePath = path.resolve(path.dirname(options.importer), options.file);
		const destPath = path.resolve(process.cwd(), options.assetsPath, filename);
		const assetsFolder = path.dirname(destPath);
		const overidePath = path.resolve('/', options.assetsPath, filename);
		mockReadFileSync.mockReturnValue(buffer);
		mockExistsSync.mockReturnValue(false);

		expect(handleAsset(options)).toBe(overidePath);

		expect(mockMkdirpSync).toBeCalledWith(assetsFolder);

		expect(mockExistsSync).toBeCalledWith(assetsFolder);

		expect(mockReadFileSync).toBeCalledWith(filePath);

		expect(mockWriteSync).toBeCalledWith(destPath, buffer);
	});

	test('test hash and publicPath', () => {
		const { handleAsset } = require('../../src/utils/urlHandler');

		const options = {
			publicPath: 'http://test/',
			assetsPath: 'lib/imgs',
			importer: './src/index.css',
			file: './imgs/test.png',
			url: 'copy',
			hash: true,
		};

		const buffer = new Buffer('hello');
		const filePath = path.resolve(path.dirname(options.importer), options.file);
		const ext = path.extname(options.file);
		const hash = crypto.createHash('md5').update(buffer).digest('hex');
		const hashName = hash + ext;
		const destPath = path.resolve(process.cwd(), options.assetsPath, hashName);
		const assetsFolder = path.dirname(destPath);
		const overidePath = options.publicPath + hashName;

		mockReadFileSync.mockReturnValue(buffer);
		mockExistsSync.mockReturnValue(true);

		expect(handleAsset(options)).toBe(overidePath);

		expect(mockExistsSync).toBeCalledWith(assetsFolder);

		expect(mockReadFileSync).toBeCalledWith(filePath);

		expect(mockWriteSync).toBeCalledWith(destPath, buffer);
	});

});

describe('Test inline option', () => {
	beforeAll(() => {
		jest.resetAllMocks();
		jest.resetModules();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	jest.mock('fs', () => {
		return {
			readFileSync: mockReadFileSync,
			existsSync: mockExistsSync,
			writeFileSync: mockWriteSync,
		};
	});

	test('test folder exists', () => {
		const { handleAsset } = require('../../src/utils/urlHandler');

		const options = {
			importer: './src/index.css',
			file: './imgs/test.jpg',
			url: 'inline',
		};

		const buffer = new Buffer('world');

		mockReadFileSync.mockReturnValue(buffer);
		mockExistsSync.mockReturnValue(false);

		expect(handleAsset(options)).toBe(`data:image/jpg;base64,${buffer.toString('base64')}`);
	});
});
