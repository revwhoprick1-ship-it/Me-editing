import json, subprocess, sys, numpy as np
SR=16000; x=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',sys.argv[1],'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout,np.float32)
n=len(x)//SR; fr=x[:n*SR].reshape(n,SR); db=20*np.log10(np.sqrt((fr**2).mean(1))+1e-6)
F=np.abs(np.fft.rfft(fr.reshape(n,10,SR//10),axis=2)); f=np.fft.rfftfreq(SR//10,1/SR)
hi=F[...,(f>2000)&(f<6000)].sum(-1).mean(1)/(F[...,(f>100)&(f<6000)].sum(-1).mean(1)+1e-9)
var=(20*np.log10(np.sqrt((fr.reshape(n,10,-1)**2).mean(2))+1e-6)).std(1)
med=np.array([np.median(db[max(0,i-30):i+30]) for i in range(n)])
r=np.clip(db-med,0,None)*0.6+(hi-np.median(hi))/(hi.std()+1e-9)*0.8+(var-np.median(var))/(var.std()+1e-9)*0.4
r=np.convolve(r,np.ones(3)/3,'same')
used=[(0,25),(192,206),(217,284),(286,303),(313,326),(350,364),(390,405),(622,638),(690,739),(965,978),(1145,1200),(1229,1245),(1323,1341),(1360,1377),(1452,1468),(1505,1562)]
tx=[l.split(None,1) for l in open(sys.argv[2]) if l.strip()]
picked=[]
for i in np.argsort(-r):
    if any(a<=i<=b for a,b in used) or any(abs(i-p)<15 for p in picked): continue
    picked.append(i)
    if len(picked)==14: break
for p in sorted(picked):
    ctx=' / '.join(t[1].strip() for t in tx if p-9<=float(t[0])<=p+3)
    print(f'{p:5d}s r={r[p]:.2f} | {ctx[:230]}')
