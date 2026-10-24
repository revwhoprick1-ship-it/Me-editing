// Installs whisper.cpp, transcribes public/input.mp4 -> public/captions.json
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {installWhisperCpp, downloadWhisperModel, transcribe, toCaptions} from '@remotion/install-whisper-cpp';

const whisperPath = path.resolve('whisper.cpp');
const model = 'medium.en';
await installWhisperCpp({to: whisperPath, version: '1.5.5'});
await downloadWhisperModel({model, folder: whisperPath});

execSync('ffmpeg -y -i public/input.mp4 -ar 16000 -ac 1 public/audio.wav', {stdio: 'inherit'});
const out = await transcribe({
  inputPath: path.resolve('public/audio.wav'), whisperPath, model,
  whisperCppVersion: '1.5.5', tokenLevelTimestamps: true,
});
const {captions} = toCaptions({whisperCppOutput: out});
fs.writeFileSync('public/captions.json', JSON.stringify(captions, null, 2));
console.log(`Wrote ${captions.length} caption tokens`);
