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
    {
      files: ['cypress.config.js', 'vite.config.js', 'babel.config.cjs', 'jest.config.cjs', 'jest.setup.cjs'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        'no-unused-vars': 'off',
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
