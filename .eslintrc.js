// module.exports = {
//     root: true,
//     extends: [
//         '@react-native-community',
//         'eslint:recommended',
//         'plugin:react/recommended',
//         'plugin:react-hooks/recommended',
//         'plugin:jsx-a11y/recommended',
//         'plugin:prettier/recommended', // Make sure this is always the last element in the array.
//     ],
//     plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier'],
//     rules: {
//         // 'prettier/prettier': 'error',
//         'react-hooks/rules-of-hooks': 'error',
//         'react-hooks/exhaustive-deps': 'warn',
//         'react/prop-types': 'off',
//         'react/display-name': 'off',
//         'jsx-a11y/accessible-emoji': 'off',
//     },
//     env: {
//         jest: true,
//         browser: true,
//         node: true,
//         es6: true,
//     },
//     settings: {
//         react: {
//             version: 'detect',
//         },
//     },
//     parserOptions: {
//         ecmaVersion: 2018,
//         sourceType: 'module',
//         ecmaFeatures: {
//             jsx: true,
//         },
//     },
// };