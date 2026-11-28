"""Switch clip layouts to the full 16:9 frame (centred box, blurred fill) without re-running face detection.
Face boxes in src/lj/<slot>.json are converted from the previous layout's output coords back to source px,
then into the 16:9 box's output coords. usage: python3 tools/lj/to169.py c1 c2 ..."""
import json, sys
W, BOX_CY = 1080, 900
K = W / 1920; TOP = BOX_CY - 1080 * K / 2
for slot in sys.argv[1:]:
    p = f'src/lj/{slot}.json'; d = json.load(open(p))
    for s in d['shots']:
        if s.get('face'):
            new = []
            for i, (ox, oy, ow, oh) in enumerate(s['face']):
                if s['mode'] == 'split':
                    k = W / 950; bottom = oy >= 960; x0, y0 = (965, 960) if bottom else (0, 0)
                    fx = x0 + ox / k; fy = s['panels']['bottom' if bottom else 'top'][i] + (oy - y0) / k; fw, fh = ow / k, oh / k
                else:
                    vw = s['vw']; k = W / vw; top = 0 if s['mode'] == 'full' else 760 - 1080 * k / 2
                    fx = s['cx'][i] - vw / 2 + ox / k; fy = (oy - top) / k; fw, fh = ow / k, oh / k
                new.append([round(fx * K, 1), round(TOP + fy * K, 1), round(fw * K, 1), round(fh * K, 1)])
            s['face'] = new
        s['mode'] = 'wide'; s['vw'] = 1920.0; s['cx'] = [960.0] * s['n']; s.pop('panels', None)
    d['layout'] = '169'
    json.dump(d, open(p, 'w')); print(slot, 'ok')
