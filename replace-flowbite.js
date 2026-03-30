const fs = require('fs');
const path = require('path');

const replacements = require('./flowbite-tailwind-replacements.json');

const dynamicRules = [
  {
    regex: /(hover:|focus:)bg-neutral-(primary|secondary|tertiary)-(soft|medium|strong)/g,
    replace: (_, prefix = '', level, strength) => {
      const map = { soft: '50', medium: '100', strong: '200' };
      return `${prefix}bg-gray-${map[strength]}`;
    }
  }
]

function replaceContent(content) {
  // dynamic replacements
  for (const rule of dynamicRules) {
    content = content.replace(rule.regex, rule.replace);
  }

  // static replacements first
  for (const [from, to] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${from}\\b`, 'g');
    content = content.replace(regex, to);
  }

  return content;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = replaceContent(original);

  if (original !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✔ Updated: ${filePath}`);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.html')) {
      processFile(fullPath);
    }
  });
}

// --- ENTRY POINT ---

const inputPath = process.argv[2];

if (!inputPath) {
  // default: ./src/app/**/*.html
  console.log('No path provided. Using default: ./src/app');
  walk(path.resolve('./src/app'));
} else {
  const resolvedPath = path.resolve(inputPath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ Path not found: ${resolvedPath}`);
    process.exit(1);
  }

  const stat = fs.statSync(resolvedPath);

  if (stat.isDirectory()) {
    walk(resolvedPath);
  } else if (resolvedPath.endsWith('.html')) {
    processFile(resolvedPath);
  } else {
    console.warn('⚠️ Not a directory or .html file, skipping.');
  }
}

console.log('✅ Flowbite class replacement done!');