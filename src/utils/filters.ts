import * as path from 'path';

/**
 * Whether the file is included in extensions.
 *
 * @param exts ".jpg", ".png", etc.
 * @param file
 */
const extFilter = (exts: string[], file: string): boolean => {
	const ext = path.extname(file);
	return exts.some((value: string): boolean => {
		return value === ext;
	});
};

/**
 * Whether the file is included in files
 *
 * @param files paths
 * @param file
 */
const fileFilter = (files: string[], file: string): boolean => {
	const rootDir = process.cwd();
	const regs = files.map<RegExp>((value: string): RegExp => {
		const regStr = path.resolve(rootDir, value).replace(/\*\*/g, '.+?').replace(/\*/g, '[^\/]+?');
		return new RegExp(regStr);
	});
	return regs.some((value: RegExp) => {
		return value.test(path.resolve(rootDir, file));
	});
};

export interface ShouldHandleOptions {
	include?: string[];
	exclude?: string[];
	extensions?: string[];
	file: string;
}

/**
 *  Whether the file should be handle
 *
 * @param options
 */
export const shouldHandle = (options: ShouldHandleOptions): boolean => {
	switch (true) {
		case options.include && !fileFilter(options.include, options.file):
			return false;
		case options.extensions && !extFilter(options.extensions, options.file):
			return false;
		case options.exclude && fileFilter(options.exclude, options.file):
			return false;
		default:
			return true;
	}
};
