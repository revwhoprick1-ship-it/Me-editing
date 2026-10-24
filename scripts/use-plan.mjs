// Point the CardPull / ShortEdit compositions at one plan file.
// Usage: node scripts/use-plan.mjs card p1_lebron   |   node scripts/use-plan.mjs pod t1_tiger
import fs from 'node:fs';
const [kind, name] = process.argv.slice(2);
const file = kind === 'card' ? 'src/activeCard.ts' : 'src/activePod.ts';
if (!fs.existsSync(`src/plans/${kind}/${name}.ts`)) throw new Error(`no plan src/plans/${kind}/${name}.ts`);
fs.writeFileSync(file, `export * from './plans/${kind}/${name}';\n`);
console.log(`${file} -> ${name}`);
