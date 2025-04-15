module.exports = {
  extends: ['react-app'],
  rules: {
    'no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'eqeqeq': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: ['node_modules/face-api.js/**/*']
}
