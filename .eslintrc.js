module.exports = {
	root: true,
	// extends: ['prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	globals: {
		jest: true,
		describe: true,
		it: true,
		expect: true,
		NodeJS: true,
		sessionStorage: true,
		global: true,
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'@typescript-eslint/no-shadow': ['error'],
				'no-shadow': 'off',
				'no-undef': 'warn',
				'react-hooks/exhaustive-deps': 'off',
				'@typescript-eslint/no-unused-vars': 'warn',
				// '@typescript-eslint/no-explicit-any': 'warn',
				'no-console': 'warn',
				quotes: [
					'warn',
					'single',
					{ avoidEscape: true, allowTemplateLiterals: true },
				],
			},
		},
	],
	env: {
		// 'jest/globals': true,
		browser: true,
		node: true,
	},
};
