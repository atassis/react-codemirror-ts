module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'airbnb-base',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.json'],
      },
    },
  },
  rules: {
    'prettier/prettier': 'error',
    quotes: ['error', 'single'],
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'no-useless-constructor': 0,
    'no-empty-function': 0,
    'class-methods-use-this': 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.spec.ts"]}]
  },
};
