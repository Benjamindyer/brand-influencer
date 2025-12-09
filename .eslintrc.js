module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	env: {
		node: true,
		es2021: true,
		jest: true,
	},
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'next/core-web-vitals',
	],
	plugins: [
		'@typescript-eslint',
		'import',
	],
	settings: {
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: './tsconfig.json',
			},
			node: {
				extensions: ['.js', '.ts', '.json']
			}
		},
	},
	overrides: [
		{
			files: ['**/*.test.ts', '**/*.spec.ts'],
			rules: {
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-call': 'off',
				'@typescript-eslint/no-unsafe-member-access': 'off',
				'@typescript-eslint/no-unsafe-argument': 'off',
				'@typescript-eslint/no-var-requires': 'off',
			}
		}
	],
	rules: {
		// Enforce tab-based indentation across the codebase
		indent: ['error', 4, {
			SwitchCase: 1,
			VariableDeclarator: 1,
			outerIIFEBody: 1,
			FunctionDeclaration: {
				parameters: 1,
				body: 1,
			},
			FunctionExpression: {
				parameters: 1,
				body: 1,
			},
		}],
		'no-tabs': 'off',
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],

		// Quotes: enforce single quotes (allow escape when needed) and prefer single in JSX
		'quotes': ['error', 'single', { avoidEscape: true }],
		'jsx-quotes': ['error', 'prefer-single'],

		// Customize minimal rules as needed
		'import/prefer-default-export': 'off',
		'max-len': ['error', { code: 120, ignoreComments: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
	},
	ignorePatterns: [
		'dist',
		'node_modules',
		'.next',
	]
};

