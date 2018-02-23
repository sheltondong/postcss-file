import { PostcssFileOptions } from '../index';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as mkdirp from 'mkdirp';

// the root directory
const rootDir = process.cwd();

/**
 * Copy asset and return the name of new file.
 *
 * @param file the absolute path of the file.
 * @param dest the destination folder.
 * @param data the file buffer.
 * @param hash use hash.
 */
const copyAsset = (file: string, dest: string, data: Buffer, hash?: boolean): string => {
	let filename: string;
	if (hash) {
		const extname = path.extname(file);
		const fileHash = crypto.createHash('md5').update(data).digest('hex');
		filename = fileHash + extname;
	} else {
		filename = path.basename(file);
	}
	if (!fs.existsSync(dest)) {
		mkdirp.sync(dest);
	}
	fs.writeFileSync(path.resolve(dest, filename), data);
	return filename;
};

export interface AssetHandlerOptions extends PostcssFileOptions {
	include?: any;
	exclude?: any;
	extensions?: any;
	importer: string;
	file: string;
}

/**
 * Handle asset and return the value of url.
 *
 * @param options
 * @returns the value of url
 */
export const handleAsset = (options: AssetHandlerOptions): string => {
	const assetPath = path.resolve(path.dirname(options.importer), options.file);
	const data = fs.readFileSync(assetPath);
	// copy or inline
	switch (options.url) {
		// copy asset to the destination path
		case 'copy':
			const assetsPath = path.resolve(rootDir, options.assetsPath as string);
			const filename = copyAsset(assetPath, assetsPath, data, options.hash);
			if (options.publicPath) {
				return options.publicPath + filename;
			} else {
				return path.resolve('/', options.assetsPath as string, filename);
			}
		// insert the asset as a inline base64 code
		case 'inline':
			const type = path.extname(assetPath).replace('.', '');
			return `data:image/${type};base64,${data.toString('base64')}`;
		// do nothing if it has a invalid url option
		default:
			return options.file;
	}
};
