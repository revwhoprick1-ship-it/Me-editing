# Reference analysis: YouTube Shorts editing style

## Status
- **Analysed (4 of 12):** the four files you uploaded, called V0–V3 here (see `01_video_reports.md` for which file is which).
- **Not analysed (8 of 12):** YouTube refused to serve video to this cloud server. Every download got a "Sign in to confirm you're not a bot" check or a 403, even signed in. They need to be uploaded as files. The link list is in `footage/refs/links.txt`.
- None of the four uploads is link #1 (`GdO_kBnp-ks`, 30 s); its metadata was read and the length doesn't match. The other links can't be matched to files until their metadata or files are available.

## Deliverables
| # | Deliverable | File |
|---|---|---|
| 1, 2, 6 | Individual reports, timestamp-by-timestamp breakdowns, hook and retention analysis | `01_video_reports.md` |
| 3 | Sound effects placement sheet | `02_sfx_placement.md` |
| 4 | Typography and text animation guide | `03_typography.md` |
| 5, 11 | Visual effects recreation guide (CapCut / Premiere / After Effects / FFmpeg / Remotion) | `04_vfx_recreation.md` |
| 7 | Comparison report | `05_comparison.md` |
| 8, 9, 10 | Master style guide, reusable timeline templates, workflow | `06_master_style_guide.md` |

Evidence is labelled **[C] confirmed** (seen or measured) or **[G] educated guess**. Sound-effect names and font names are guesses. Timings, frequencies, zoom factors and levels are measured.

## Re-running the analysis on new references
```
python3 tools/cuts.py ref.mp4 0.25 > ref.cuts.txt
python3 tools/transcribe.py ref.mp4 ref.words.json
python3 tools/vismetrics.py ref.mp4 ref.vis.json
python3 tools/audonsets.py ref.mp4 ref.aud.json
python3 tools/shotcheck.py ref.mp4 ref.cuts.txt        # new shot vs punch-in (scale)
python3 tools/sheet.py ref.mp4 sheet.png 0.5 0 12 6 300 # contact sheet
python3 tools/timeline.py ref.mp4 ref.vis.json ref.words.json ref.cuts.txt tl.png 0 10  # frames+spectrogram+metrics
```
`timeline.py` needs `pip install matplotlib`.
