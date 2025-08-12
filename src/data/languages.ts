export interface LanguageMapping {
  smallImageKey: string;
  label: string;
  extensions?: string[];
  languageIds?: string[];
}

export const languageMappings: LanguageMapping[] = [
  // Generic File Types (should come first for priority)
  {
    smallImageKey: 'devicon--json',
    label: 'JSON',
    extensions: ['.json'],
    languageIds: ['json', 'jsonc']
  },
  {
    smallImageKey: 'devicon--xml',
    label: 'XML',
    extensions: ['.xml', '.xsd', '.xsl', '.xslt'],
    languageIds: ['xml']
  },
  {
    smallImageKey: 'devicon--yaml',
    label: 'YAML',
    extensions: ['.yml', '.yaml'],
    languageIds: ['yaml']
  },
  {
    smallImageKey: 'devicon--markdown',
    label: 'Markdown',
    extensions: ['.md', '.markdown', '.mdown', '.mkd'],
    languageIds: ['markdown']
  },
  {
    smallImageKey: 'skill-icons--bash-dark',
    label: 'Shell Script',
    extensions: ['.sh', '.bash', '.zsh', '.fish'],
    languageIds: ['shellscript', 'bash', 'zsh', 'fish']
  },
  {
    smallImageKey: 'devicon--powershell',
    label: 'PowerShell',
    extensions: ['.ps1', '.psm1', '.psd1'],
    languageIds: ['powershell']
  },

  // Web Technologies
  {
    smallImageKey: 'html',
    label: 'HTML',
    extensions: ['.html', '.htm', '.xhtml'],
    languageIds: ['html', 'html-eex', 'jade', 'pug']
  },
  {
    smallImageKey: 'css',
    label: 'CSS',
    extensions: ['.css', '.scss', '.sass', '.less', '.styl'],
    languageIds: ['css', 'scss', 'sass', 'less', 'stylus']
  },
  {
    smallImageKey: 'javascript',
    label: 'JavaScript',
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    languageIds: ['javascript', 'javascriptreact', 'jsx']
  },
  {
    smallImageKey: 'typescript',
    label: 'TypeScript',
    extensions: ['.ts', '.tsx', '.mts', '.cts'],
    languageIds: ['typescript', 'typescriptreact']
  },
  {
    smallImageKey: 'react-light',
    label: 'React',
    extensions: ['.jsx', '.tsx'],
    languageIds: ['javascriptreact', 'typescriptreact']
  },
  {
    smallImageKey: 'vuejs-light',
    label: 'Vue',
    extensions: ['.vue'],
    languageIds: ['vue', 'vue-html']
  },
  {
    smallImageKey: 'svelte',
    label: 'Svelte',
    extensions: ['.svelte'],
    languageIds: ['svelte']
  },
  {
    smallImageKey: 'solidjs-dark',
    label: 'SolidJS',
    extensions: ['.jsx', '.tsx'],
    languageIds: ['javascriptreact', 'typescriptreact']
  },
  {
    smallImageKey: 'angular-light',
    label: 'Angular',
    extensions: ['.ts', '.html'],
    languageIds: ['typescript', 'html']
  },
  {
    smallImageKey: 'nextjs-dark',
    label: 'Next.js',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    languageIds: ['javascript', 'javascriptreact', 'typescript', 'typescriptreact']
  },
  {
    smallImageKey: 'nuxtjs-dark',
    label: 'Nuxt.js',
    extensions: ['.vue', '.js', '.ts'],
    languageIds: ['vue', 'javascript', 'typescript']
  },
  {
    smallImageKey: 'gatsby',
    label: 'Gatsby',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    languageIds: ['javascript', 'javascriptreact', 'typescript', 'typescriptreact']
  },
  {
    smallImageKey: 'astro',
    label: 'Astro',
    extensions: ['.astro'],
    languageIds: ['astro']
  },
  {
    smallImageKey: 'sass',
    label: 'Sass',
    extensions: ['.scss', '.sass'],
    languageIds: ['scss', 'sass']
  },
  {
    smallImageKey: 'tailwindcss-dark',
    label: 'Tailwind CSS',
    extensions: ['.css', '.scss'],
    languageIds: ['css', 'scss']
  },
  {
    smallImageKey: 'htmx-dark',
    label: 'HTMX',
    extensions: ['.html', '.htm'],
    languageIds: ['html']
  },

  // Backend & Server
  {
    smallImageKey: 'python',
    label: 'Python',
    extensions: ['.py', '.pyw', '.pyi', '.pyx', '.pyz'],
    languageIds: ['python']
  },
  {
    smallImageKey: 'django',
    label: 'Django',
    extensions: ['.py'],
    languageIds: ['python']
  },
  {
    smallImageKey: 'fastapi',
    label: 'FastAPI',
    extensions: ['.py'],
    languageIds: ['python']
  },
  {
    smallImageKey: 'java-light',
    label: 'Java',
    extensions: ['.java', '.class', '.jar'],
    languageIds: ['java']
  },
  {
    smallImageKey: 'csharp',
    label: 'C#',
    extensions: ['.cs', '.csx'],
    languageIds: ['csharp']
  },
  {
    smallImageKey: 'cpp',
    label: 'C++',
    extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hh', '.hxx'],
    languageIds: ['cpp', 'cppheader']
  },
  {
    smallImageKey: 'c',
    label: 'C',
    extensions: ['.c', '.h'],
    languageIds: ['c', 'c-header']
  },
  {
    smallImageKey: 'golang',
    label: 'Go',
    extensions: ['.go'],
    languageIds: ['go']
  },
  {
    smallImageKey: 'rust',
    label: 'Rust',
    extensions: ['.rs'],
    languageIds: ['rust']
  },
  {
    smallImageKey: 'ruby',
    label: 'Ruby',
    extensions: ['.rb', '.erb', '.rbs'],
    languageIds: ['ruby']
  },
  {
    smallImageKey: 'rails',
    label: 'Rails',
    extensions: ['.rb', '.erb'],
    languageIds: ['ruby']
  },
  {
    smallImageKey: 'devicon--php',
    label: 'PHP',
    extensions: ['.php', '.phtml', '.php3', '.php4', '.php5', '.php7'],
    languageIds: ['php']
  },
  {
    smallImageKey: 'nestjs-dark',
    label: 'NestJS',
    extensions: ['.ts', '.js'],
    languageIds: ['typescript', 'javascript']
  },

  // Cloud & DevOps (specific file patterns)
  {
    smallImageKey: 'aws-light',
    label: 'AWS CloudFormation',
    extensions: ['cloudformation.yml', 'cloudformation.yaml', 'template.yml', 'template.yaml', '.tf', '.tfvars'],
    languageIds: ['terraform']
  },
  {
    smallImageKey: 'azure-dark',
    label: 'Azure',
    extensions: ['azuredeploy.json', 'azuredeploy.yml', 'azure-pipelines.yml', '.bicep'],
    languageIds: ['bicep']
  },
  {
    smallImageKey: 'gcp-dark',
    label: 'Google Cloud',
    extensions: ['cloudbuild.yaml', 'cloudbuild.yml', 'deployment.yaml', 'deployment.yml'],
    languageIds: ['yaml']
  },
  {
    smallImageKey: 'cloudflare-light',
    label: 'Cloudflare',
    extensions: ['.js', '.ts', '.toml'],
    languageIds: ['javascript', 'typescript', 'toml']
  },
  {
    smallImageKey: 'docker',
    label: 'Docker',
    extensions: ['.dockerfile', '.dockerignore'],
    languageIds: ['dockerfile']
  },
  {
    smallImageKey: 'git',
    label: 'Git',
    extensions: ['.gitignore', '.gitattributes', '.gitmodules'],
    languageIds: ['gitignore', 'gitattributes', 'gitmodules']
  },
  {
    smallImageKey: 'gitlab-dark',
    label: 'GitLab',
    extensions: ['.gitlab-ci.yml', '.gitlab-ci.yaml'],
    languageIds: ['yaml']
  },
  {
    smallImageKey: 'bitbucket-dark',
    label: 'Bitbucket',
    extensions: ['.bitbucket-pipelines.yml'],
    languageIds: ['yaml']
  },

  // Build Tools & Package Managers
  {
    smallImageKey: 'devicon--npm',
    label: 'npm',
    extensions: ['package.json', 'package-lock.json'],
    languageIds: ['json']
  },
  {
    smallImageKey: 'devicon--pnpm',
    label: 'pnpm',
    extensions: ['pnpm-lock.yaml', 'pnpm-workspace.yaml'],
    languageIds: ['yaml']
  },
  {
    smallImageKey: 'yarn-light',
    label: 'Yarn',
    extensions: ['yarn.lock', '.yarnrc', '.yarnrc.yml'],
    languageIds: ['yaml', 'json']
  },
  {
    smallImageKey: 'bun-light',
    label: 'Bun',
    extensions: ['bun.lockb', 'bunfig.toml'],
    languageIds: ['toml']
  },
  {
    smallImageKey: 'vite-light',
    label: 'Vite',
    extensions: ['vite.config.js', 'vite.config.ts', 'vite.config.mjs'],
    languageIds: ['javascript', 'typescript']
  },
  {
    smallImageKey: 'webpack-dark',
    label: 'Webpack',
    extensions: ['webpack.config.js', 'webpack.config.ts'],
    languageIds: ['javascript', 'typescript']
  },
  {
    smallImageKey: 'rollupjs-dark',
    label: 'Rollup',
    extensions: ['rollup.config.js', 'rollup.config.ts'],
    languageIds: ['javascript', 'typescript']
  },
  {
    smallImageKey: 'gradle-dark',
    label: 'Gradle',
    extensions: ['build.gradle', 'build.gradle.kts', 'gradle.properties'],
    languageIds: ['groovy', 'kotlin', 'properties']
  },

  // Databases & Data
  {
    smallImageKey: 'sqlite',
    label: 'SQLite',
    extensions: ['.sql', '.sqlite', '.sqlite3', '.db'],
    languageIds: ['sql']
  },
  {
    smallImageKey: 'redis-dark',
    label: 'Redis',
    extensions: ['.redis', '.rdb'],
    languageIds: ['redis']
  },
  {
    smallImageKey: 'graphql-dark',
    label: 'GraphQL',
    extensions: ['.graphql', '.gql'],
    languageIds: ['graphql']
  },

  // Mobile & Desktop
  {
    smallImageKey: 'flutter-dark',
    label: 'Flutter',
    extensions: ['.dart'],
    languageIds: ['dart']
  },
  {
    smallImageKey: 'electron',
    label: 'Electron',
    extensions: ['.js', '.ts', '.json'],
    languageIds: ['javascript', 'typescript', 'json']
  },
  {
    smallImageKey: 'godot-light',
    label: 'Godot',
    extensions: ['.gd', '.tscn', '.tres'],
    languageIds: ['gdscript', 'gdshader']
  },

  // AI & ML
  {
    smallImageKey: 'tensorflow-dark',
    label: 'TensorFlow',
    extensions: ['.py', '.ipynb'],
    languageIds: ['python', 'jupyter']
  },
  {
    smallImageKey: 'r-light',
    label: 'R',
    extensions: ['.r', '.R', '.Rmd'],
    languageIds: ['r', 'rmarkdown']
  },

  // Other Technologies
  {
    smallImageKey: 'babel',
    label: 'Babel',
    extensions: ['.babelrc', '.babelrc.js', '.babelrc.json'],
    languageIds: ['json', 'javascript']
  },
  {
    smallImageKey: 'eslint',
    label: 'ESLint',
    extensions: ['.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml'],
    languageIds: ['json', 'javascript', 'yaml']
  },
  {
    smallImageKey: 'prettier',
    label: 'Prettier',
    extensions: ['.prettierrc', '.prettierrc.js', '.prettierrc.json', '.prettierrc.yml'],
    languageIds: ['json', 'javascript', 'yaml']
  },
  {
    smallImageKey: 'regex-dark',
    label: 'Regular Expressions',
    extensions: ['.regex', '.re'],
    languageIds: ['regexp']
  },
  {
    smallImageKey: 'webassembly',
    label: 'WebAssembly',
    extensions: ['.wasm', '.wat'],
    languageIds: ['wasm', 'wat']
  },
  {
    smallImageKey: 'workers-dark',
    label: 'Cloudflare Workers',
    extensions: ['.js', '.ts'],
    languageIds: ['javascript', 'typescript']
  },
  {
    smallImageKey: 'rocket',
    label: 'Rust Rocket',
    extensions: ['.rs'],
    languageIds: ['rust']
  },
  {
    smallImageKey: 'deno-light',
    label: 'Deno',
    extensions: ['.ts', '.js', '.json'],
    languageIds: ['typescript', 'javascript', 'json']
  },
  {
    smallImageKey: 'emotion-dark',
    label: 'Emotion',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    languageIds: ['javascript', 'javascriptreact', 'typescript', 'typescriptreact']
  },
  {
    smallImageKey: 'redux',
    label: 'Redux',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    languageIds: ['javascript', 'javascriptreact', 'typescript', 'typescriptreact']
  },
  {
    smallImageKey: 'threejs-light',
    label: 'Three.js',
    extensions: ['.js', '.ts'],
    languageIds: ['javascript', 'typescript']
  },
  {
    smallImageKey: 'vitest-dark',
    label: 'Vitest',
    extensions: ['.js', '.ts', '.mjs'],
    languageIds: ['javascript', 'typescript']
  },
  {
    smallImageKey: 'appwrite',
    label: 'Appwrite',
    extensions: ['.js', '.ts'],
    languageIds: ['javascript', 'typescript']
  },
  {
    smallImageKey: 'bootstrap',
    label: 'Bootstrap',
    extensions: ['.css', '.scss', '.html'],
    languageIds: ['css', 'scss', 'html']
  },
  {
    smallImageKey: 'discordjs-dark',
    label: 'Discord.js',
    extensions: ['.js', '.ts'],
    languageIds: ['javascript', 'typescript']
  }
];

export const findLanguageMapping = (
  fileName?: string,
  languageId?: string
): LanguageMapping | undefined => {
  if (!fileName && !languageId) return undefined;

  // First try to match by file extension
  if (fileName) {
    const extension = fileName.toLowerCase();
    const mapping = languageMappings.find(mapping =>
      mapping.extensions?.some(ext => extension.endsWith(ext.toLowerCase()))
    );
    if (mapping) return mapping;
  }

  // Then try to match by language ID
  if (languageId) {
    const mapping = languageMappings.find(mapping =>
      mapping.languageIds?.some(id => id.toLowerCase() === languageId.toLowerCase())
    );
    if (mapping) return mapping;
  }

  return undefined;
};


