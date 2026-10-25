// Point the CardPull / ShortEdit compositions at one plan file.
// Usage: node scripts/use-plan.mjs card p1_lebron   |   pod t1_tiger   |   edit2 playbook
import fs from 'node:fs';
const [kind, name] = process.argv.slice(2);
const file = {card: 'src/activeCard.ts', pod: 'src/activePod.ts', edit2: 'src/activeEdit2.ts'}[kind];
if (!fs.existsSync(`src/plans/${kind}/${name}.ts`)) throw new Error(`no plan src/plans/${kind}/${name}.ts`);
fs.writeFileSync(file, `export * from './plans/${kind}/${name}';\n`);
console.log(`${file} -> ${name}`);
