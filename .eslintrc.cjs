module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
  ],
  overrides: [
    {
      files: ['cypress/**/*.cy.js'],
      extends: ['plugin:cypress/recommended'],
    },
    {
      files: ['src/__tests__/**/*.js', 'src/__tests__/**/*.jsx'],
      env: {
        jest: true,
      },
    },
  ],
  plugins: [
    'react',
    'react-hooks',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn',
    'import/extensions': 'off',
    'no-param-reassign': ['error', { props: false }],
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.js'] }],
  },
};
