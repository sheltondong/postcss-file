# PostCSS File

[PostCSS]: https://github.com/postcss/postcss

[PostCSS] File is a assets handler for css. It can copies assets and overwrites your url, it also can inserts images as a inline data.

# Installation

```shell
npm install --save-dev postcss-file
```

# Usage

## Webpack
```javascript
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.css$/,
        use: [{
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('postcss-file')({
                url: 'copy',
                assetsPath: 'dist/assets',
                publicPath: './assets/',
                hash: true
              })
            ],
          },
        }]
      }
    ]
  }
}
```

## Rollup
```javascript
// rollup.config.js
import postcss from 'postcss';

const config = {
  // ...
  plugins: [
    // ...
    postcss({
      // ...
      plugins: [
        require('postcss-file')({
          url: 'copy',
          assetsPath: 'dist/assets',
          publicPath: './assets/',
          hash: true
        })
      ]
    })
  ]
};

export default config;
```
#### Note: You must use options to specify how would you like to handle your assets in your css, if you don't pass any options, PostCSS File will do nothing about your assets.

# Url Resolve

You can copy your assets to anywhere or insert them as inline data through "url" option.

## Copy

```javascript
postcss({
  plugins: [
    require({
      url: 'copy',
      assetsPath: './dist/assets',
      publicPath: 'assets/'
    })
  ]
})
```

Input:

```css
.app-body {
  background-image: url('./imgs/background.png');
}
```

Output:

```css
.app-body {
  background-image: url('./assets/background.png');
}
```

#### Note: Remember that you should specify the publicPath option since we know nothing about your structure of your project directories, and also we don't know where you want to output your css file. If you don't specify the publicPath option, we would use the assetsPath option to be your url prefix, and obviously, it is normally not what you want.

## Inline
```javascript
postcss({
  plugins: [
    require({
      url: 'inline',
    })
  ]
})
```

Input:

```css
.app-body {
  background-image: url('./imgs/background.png');
}
```

Output:

```css
.app-body {
  background-image: url('data:image/png;base64,<base64>');
}
```

# Options
option | description | default
---- | ---- | ----
url | determines how to handle the url, "copy" or "inline". require assetsPath | "inline"
assetsPath | where the assets should be copy to. | undefined
publicPath | the prefix of output url | undefined
extensions | determines which type of files should be handle | all
include | determines where to search for assets | all
exclude | determines which folder should be exclided | none
hash | use hash to be the asset's name | false

See [PostCSS] docs for examples for your environment.
