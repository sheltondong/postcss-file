import * as postcss from 'postcss';
import { Transformer } from 'postcss';
import { shouldHandle } from './utils/filters';
import { handleAsset } from './utils/urlHandler';
import { validateOptions } from './utils/validators';

// Url type
export type URL = 'copy' | 'inline';

/**
 * PostCSS File plugin options
 *
 * @property extensions
 * @property include
 * @property exclude
 * @property url
 * @property assetsPath
 * @property publicPath
 * @property hash
 */
export interface PostcssFileOptions extends Object {
	/**
   * @default undefined
   * @description determines which type of files should be handle
   */
	extensions?: string[];
	/**
   * @default undefined
   * @description determines where to search for assets
   */
	include?: string[];
	/**
   * @default undefined
   * @description determines which folder should be exclided
   */
	exclude?: string[];
	/**
   * @default "inline"
   * @description determines how to handle the url, "copy" or "inline". require assetsPath | "inline"
   */
	url?: URL;
	/**
   * @default undefined
   * @description where the assets should be copy to.
   */
	assetsPath?: string;
	/**
   * @default undefined
   * @description the prefix of output url
   */
	publicPath?: string;
	/**
   * @default false
   * @description use hash to be the asset's name
   */
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
				// do nothing if this declaration is already have been handled
				if ((decl as any).handled) {
					return;
				}
				// set handled flag to fix the error, which would handle assets repetitively.
				(decl as any).handled = true;
				// test whether there is url value
				if (!/url/.test(decl.value)) {
					return;
				}
				// test whether the value of url is valid
				const urlReg = /url\((\"|\')?(.+?)(\1)\)/g;
				// overwrite the url value
				decl.value = decl.value.replace(urlReg, (match, $1, $2, $3) => {
					const file = $2;
					// test whether the asset is included
					const handleOptions = {
						include: opts.include,
						exclude: opts.exclude,
						extensions: opts.extensions,
						file
					};
					if (!shouldHandle(handleOptions)) {
						return match;
					}
					// handle asset
					const urlValue = handleAsset({
						...opts,
						importer: decl.source.input.file,
						file
					});
					return `url(${$1 + urlValue + $3})`;
				});
			});
		};
	}
);
