import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseWeBurnInterview } from '../src/utils/weBurnInterview.mjs';

const NO_PLAN_EDITORIAL_START = 'FUTURE — We Burn。NOW — NO PLAN。ORIGIN — Back to the Spark - Live Version -。';

// Render the actual TSX copy component, not a parallel test implementation.
const exports = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/campaigns/WeBurnInterviewCopy.tsx', 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, { exports, require: name => { assert.equal(name, 'react'); return React; } });
const copy = blocks => renderToStaticMarkup(React.createElement(exports.WeBurnInterviewCopy, { blocks }));
const articles = JSON.parse(fs.readFileSync('content/public/articles.json', 'utf8'));
const parsed = {};
for (const [slug, file] of [['five-directions', 'WB25-TXT-FEAT01_v01.md'], ['no-plan', 'WB25-TXT-FEAT02_v01.md']]) {
  const source = fs.readFileSync(`content/canonical/we-burn/${file}`, 'utf8');
  assert.equal(articles.find(a => a.slug === slug).canonicalMarkdown, source);
  const sections = parseWeBurnInterview(source, { closingEditorialStart: slug === 'no-plan' ? NO_PLAN_EDITORIAL_START : undefined });
  parsed[slug] = sections;
  const reconstructed = sections.flatMap(s => [s.heading, ...s.blocks.flatMap(b => b.paragraphs.map((p, i) => b.type === 'speech' && i === 0 ? b.label + b.separator + p : p))]).filter(Boolean);
  const expected = source.replace(/\r/g, '').split('\n').filter(l => l.trim()).slice(1).map(l => l.replace(/^##\s+/, ''));
  assert.deepEqual(reconstructed, expected, `${slug}: exact paragraphs, order and labels`);
  const html = sections.map(s => copy(s.blocks)).join('');
  assert.equal((html.match(/<p(?: |>)/g) || []).length, sections.flatMap(s => s.blocks).reduce((n, b) => n + b.paragraphs.length, 0));
  assert.equal((html.match(/data-speaker=/g) || []).length, (source.match(/^(KAI|SHO|LEO|REN|YUTO)：/gm) || []).length);
  assert.equal((html.match(/<strong>/g) || []).length, (source.match(/^(KAI|SHO|LEO|REN|YUTO)：/gm) || []).length);
}
const sho = parsed['no-plan'][1].blocks.find(b => b.type === 'speech' && b.paragraphs[0].includes('ライブにも行っています'));
assert.equal(sho.speaker, 'SHO');
assert.equal(sho.paragraphs.length, 2);
assert.ok(sho.paragraphs[1].startsWith('例えば、ベース'));
assert.match(copy([sho]), /data-speaker="SHO"><p><strong>SHO：<\/strong>[^]*<\/p><p>例えば、ベース[^]*<\/p><\/div>/);
const kai = parsed['five-directions'][1].blocks.find(b => b.type === 'speech');
assert.equal(kai.paragraphs.length, 3, 'blank lines must not end a speech');
assert.ok(parsed['five-directions'][1].blocks.some(b => b.type === 'question'));
const ending = parsed['no-plan'].at(-1).blocks;
assert.equal(ending.at(-6).type, 'speech');
assert.equal(ending.at(-6).speaker, 'KAI');
assert.equal(ending.at(-6).paragraphs.length, 2);
assert.ok(ending.slice(-5).every(b => b.type === 'editorial'), 'closing prose must not become KAI dialogue');
const fixture = parseWeBurnInterview('# Title\n\n**SHO：** first\n\nsecond\n――Question\nSHO： reply\nLEO： next\n## Chapter\nEditorial');
assert.deepEqual(fixture[0].blocks.map(b => b.type), ['speech', 'question', 'speech', 'speech']);
assert.deepEqual(fixture[0].blocks[0].paragraphs, ['first', 'second']);
assert.equal(fixture[1].blocks[0].type, 'editorial');
assert.match(copy(fixture[0].blocks), /<strong>SHO：<\/strong> first<\/p><p>second<\/p>/);
console.log('We Burn interview regression checks passed: exact source/data/paragraphs, speech ownership, questions, headings, editorial boundary, bold labels and actual rendered HTML.');
