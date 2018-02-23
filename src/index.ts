import * as postcss from 'postcss';
import { Transformer } from 'postcss';
import { shouldHandle } from './utils/filters';
import { handleAsset } from './utils/urlHandler';
import { validateOptions } from './utils/validators';

export type URL = 'copy' | 'inline';

export interface PostcssFileOptions {
	extensions?: string[];
	include?: string[];
	exclude?: string[];
	url?: URL;
	assetsPath?: string;
	publicPath?: string;
	hash?: boolean;
}

export default postcss.plugin<PostcssFileOptions>('postcss-file', (options): Transformer => {
		// it would throw error if options is invalid.
		validateOptions(options);
		// initialize options
		const opts: PostcssFileOptions =
			options && Object.prototype.isPrototypeOf(options) ? options : {
				url: 'inline'
			};

		return function(root) {
			root.walkDecls(/(background|src)/, function(decl) {
				// test whether there is url value
				if (!/url/.test(decl.value)) {
					return;
				}
				// test whether the value of url is valid
				const urlReg = /(\"|\')(.+?)(\1)/;
				const matchs: RegExpMatchArray | null = decl.value.match(urlReg);
				if (matchs === null) {
					return;
				}
				// the file of url
				const file = matchs[2];
				// test whether the asset is included
				const handleOptions = {
					include: opts.include,
					exclude: opts.exclude,
					extensions: opts.extensions,
					file
				};
				if (!shouldHandle(handleOptions)) {
					return;
				}
				// handle asset
				const urlValue = handleAsset({
					...opts,
					importer: decl.source.input.file,
					file
				});
				// overwrite the url value
				decl.value = `url('${urlValue}')`;
			});
		};
	}
);
