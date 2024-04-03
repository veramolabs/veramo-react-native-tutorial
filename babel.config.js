module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { lazyImports: true }]],
    plugins: [
      '@babel/transform-react-jsx-source',
      [`@babel/plugin-transform-private-methods`, { loose: true }],
      'babel-plugin-transform-typescript-metadata',
      [
        'module-resolver',
        {
          alias: {
            '~': './src',
          },
        },
      ],
      '@babel/plugin-syntax-import-assertions',
      [
        'babel-plugin-rewrite-require',
        {
          aliases: {
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
          },
        },
      ],
      // 'react-native-reanimated/plugin',
    ],
  };
};
