# Clipfarm x CLASH (House of Highlights): "Guess The Secret Heisman Winner" (Nov 18)
- Brief: Google Doc 1B3sK-BmRzNnsMrNPatsq50C7RbKnCdfaU65Mn6eHHAE. Episode = Drive 1bEDaKZU8htsFEM4q4erf_ojKIebj9Tvo (user gave a Dropbox copy); backup WeTransfer t-gsi0XT595rMafehn (not needed).
- Rules: only this episode's footage (b-roll of players ≤3 s each, ≤50% of clip). Keep it positive, don't make fun of the show/people, little swearing, no other sports brands. Tag TikTok @Clash.hoh · IG @Clash.HoH · YT @Clash; tell people where to watch the full episode. 40%+ US/UK/CA/AU.
- Episode: 4 hosts at a desk + 6 numbered "Heisman winners"; real one is #4 = Troy Smith (Ohio State). Funniest bits = #4's deadpan answers, #1's snap count.
- Style: ORIGINAL VverPaldo (commit 7df7760, before the R3born viewer-agent rounds): payoff hook + hard cut white flash, centre echo emoji pops (y 800, size 380), skull after top line, one ask pill, promo line ("Full episode on CLASH") only in the last 2.5 s, no sub line / speaker tags / text pops. Plus user rules: face on frame 1 with short blur-focus, ≤1 red circle checked on frames.
- plan_clash.py → src/clash.cfg.json; scene tuple's 5th value = cropX (centre of the 1080 window in the 1920 frame). Host two-shots: faces ~860 px apart, cropX 825-912 keeps both.
- Batch 1: chheight, chsnap, chdiddly, chspeech, chreveal.
