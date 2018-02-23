import { PostcssFileOptions } from '../index';
import chalk from 'chalk';

const warn = (message: string) => {
	console.warn(chalk.bold.yellow(message));
};

export const validateOptions = (options: PostcssFileOptions | undefined) => {
	if (!options) {
		return false;
	}
	if (options.url && options.url !== 'copy' && options.url !== 'inline') {
		warn(`(!) The url option must be one of "copy" or "inline".`);
	}
	if (options.url === 'copy' && !options.publicPath) {
		warn(`(!) Missing options "publicPath", publicPath should be specified in "copy" mode.`);
	}
	if (options && options.url === 'copy' && !options.assetsPath) {
		throw new Error(`Missing option "assetsPath".`);
	}
};
