import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: './src/index.js',
    output: [
      { file: 'dist/index.js', format: 'cjs', exports: 'named' },
      { file: 'dist/index.es.js', format: 'es', exports: 'named' },
    ],
    plugins: [
      external(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', { targets: { chrome: '80', firefox: '75', safari: '13.1', edge: '80' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      }),
      terser(),
    ],
    // keep the automatic JSX runtime subpath external too
    external: ['react/jsx-runtime'],
  },
];
