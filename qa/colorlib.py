import math
def hex2rgb(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))
def lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def oklab(h):
    r,g,b=[lin(x) for x in hex2rgb(h)]
    l=0.4122214708*r+0.5363325363*g+0.0514459929*b; m=0.2119034982*r+0.6806995451*g+0.1073969566*b; s=0.0883024619*r+0.2817188376*g+0.6299787005*b
    l,m,s=[x**(1/3) for x in (l,m,s)]
    return (0.2104542553*l+0.7936177850*m-0.0040720468*s, 1.9779984951*l-2.4285922050*m+0.4505937099*s, 0.0259040371*l+0.7827717662*m-0.8086757660*s)
def oklch(h):
    L,a,b=oklab(h); return L, math.hypot(a,b), (math.degrees(math.atan2(b,a))+360)%360
def dE(h1,h2): return math.dist(oklab(h1),oklab(h2))*100
def Y(h): r,g,b=[lin(x) for x in hex2rgb(h)]; return 0.2126*r+0.7152*g+0.0722*b
def cr(a,b): A,B=sorted([Y(a),Y(b)],reverse=True); return (A+0.05)/(B+0.05)
# Machado 2009 CVD matrices (severity 1.0), applied in linear RGB
CVD={'deuteranopia':[[0.367322,0.860646,-0.227968],[0.280085,0.672501,0.047413],[-0.011820,0.042940,0.968881]],
     'protanopia':[[0.152286,1.052583,-0.204868],[0.114503,0.786281,0.099216],[-0.003882,-0.048116,1.051998]],
     'tritanopia':[[1.255528,-0.076749,-0.178779],[-0.078411,0.930809,0.147602],[0.004733,0.691367,0.303900]]}
def unlin(c): c=max(0,min(1,c)); return 12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055
def sim(h,kind):
    v=[lin(x) for x in hex2rgb(h)]; M=CVD[kind]
    o=[sum(M[i][j]*v[j] for j in range(3)) for i in range(3)]
    return '#%02X%02X%02X'%tuple(round(unlin(x)*255) for x in o)
