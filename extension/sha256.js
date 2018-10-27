/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2017
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
(function(N){function u(b,a,d){var e=0,c=[],f=0,p=!1,g=[],h=[],m=!1;d=d||{};var E=d.encoding||"UTF8";var t=d.numRounds||1;if(t!==parseInt(t,10)||1>t)throw Error("numRounds must a integer >= 1");if(0===b.lastIndexOf("SHA-",0)){var n=function(a,c){return B(a,c,b)};var q=function(a,c,d,e){if("SHA-224"===b||"SHA-256"===b){var p=(c+65>>>9<<4)+15;var f=16}else throw Error("Unexpected error in SHA-2 implementation");for(;a.length<=p;)a.push(0);a[c>>>5]|=128<<24-c%32;c+=d;a[p]=c&4294967295;a[p-1]=c/4294967296|
0;d=a.length;for(c=0;c<d;c+=f)e=B(a.slice(c,c+f),e,b);if("SHA-224"===b)a=[e[0],e[1],e[2],e[3],e[4],e[5],e[6]];else if("SHA-256"===b)a=e;else throw Error("Unexpected error in SHA-2 implementation");return a};var l=function(a){return a.slice()};if("SHA-224"===b){var k=512;var r=224}else if("SHA-256"===b)k=512,r=256;else throw Error("Chosen SHA variant is not supported");}else throw Error("Chosen SHA variant is not supported");var u=H(a,E,-1);var v=y(b);this.setHMACKey=function(a,c,d){if(!0===p)throw Error("HMAC key already set");
if(!0===m)throw Error("Cannot set HMAC key after calling update");E=(d||{}).encoding||"UTF8";c=H(c,E,-1)(a);a=c.binLen;c=c.value;var f=k>>>3;d=f/4-1;if(f<a/8){for(c=q(c,a,0,y(b),r);c.length<=d;)c.push(0);c[d]&=4294967040}else if(f>a/8){for(;c.length<=d;)c.push(0);c[d]&=4294967040}for(a=0;a<=d;a+=1)g[a]=c[a]^909522486,h[a]=c[a]^1549556828;v=n(g,v);e=k;p=!0};this.update=function(a){var b,d=0,p=k>>>5;var g=u(a,c,f);a=g.binLen;var h=g.value;g=a>>>5;for(b=0;b<g;b+=p)d+k<=a&&(v=n(h.slice(b,b+p),v),d+=k);
e+=d;c=h.slice(d>>>5);f=a%k;m=!0};this.getHash=function(a,d){if(!0===p)throw Error("Cannot call getHash after setting HMAC key");var g=I(d);switch(a){case "HEX":a=function(a){return J(a,r,-1,g)};break;case "B64":a=function(a){return K(a,r,-1,g)};break;case "BYTES":a=function(a){return L(a,r,-1)};break;case "ARRAYBUFFER":try{d=new ArrayBuffer(0)}catch(x){throw Error("ARRAYBUFFER not supported by this environment");}a=function(a){return M(a,r,-1)};break;default:throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
}var h=q(c.slice(),f,e,l(v),r);for(d=1;d<t;d+=1)h=q(h,r,0,y(b),r);return a(h)};this.getHMAC=function(a,d){if(!1===p)throw Error("Cannot call getHMAC without first setting HMAC key");var g=I(d);switch(a){case "HEX":a=function(a){return J(a,r,-1,g)};break;case "B64":a=function(a){return K(a,r,-1,g)};break;case "BYTES":a=function(a){return L(a,r,-1)};break;case "ARRAYBUFFER":try{a=new ArrayBuffer(0)}catch(x){throw Error("ARRAYBUFFER not supported by this environment");}a=function(a){return M(a,r,-1)};
break;default:throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");}d=q(c.slice(),f,e,l(v),r);var m=n(h,y(b));m=q(d,r,k,m,r);return a(m)}}function l(){}function J(b,a,d,e){var c="";a/=8;var f;var p=-1===d?3:0;for(f=0;f<a;f+=1){var g=b[f>>>2]>>>8*(p+f%4*d);c+="0123456789abcdef".charAt(g>>>4&15)+"0123456789abcdef".charAt(g&15)}return e.outputUpper?c.toUpperCase():c}function K(b,a,d,e){var c="",f=a/8,p;var g=-1===d?3:0;for(p=0;p<f;p+=3){var h=p+1<f?b[p+1>>>2]:0;var m=p+2<f?b[p+2>>>2]:
0;m=(b[p>>>2]>>>8*(g+p%4*d)&255)<<16|(h>>>8*(g+(p+1)%4*d)&255)<<8|m>>>8*(g+(p+2)%4*d)&255;for(h=0;4>h;h+=1)8*p+6*h<=a?c+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m>>>6*(3-h)&63):c+=e.b64Pad}return c}function L(b,a,d){var e="";a/=8;var c;var f=-1===d?3:0;for(c=0;c<a;c+=1){var p=b[c>>>2]>>>8*(f+c%4*d)&255;e+=String.fromCharCode(p)}return e}function M(b,a,d){a/=8;var e,c=new ArrayBuffer(a);var f=new Uint8Array(c);var p=-1===d?3:0;for(e=0;e<a;e+=1)f[e]=b[e>>>2]>>>8*(p+
e%4*d)&255;return c}function I(b){var a={outputUpper:!1,b64Pad:"=",shakeLen:-1};b=b||{};a.outputUpper=b.outputUpper||!1;!0===b.hasOwnProperty("b64Pad")&&(a.b64Pad=b.b64Pad);b.hasOwnProperty("shakeLen");if("boolean"!==typeof a.outputUpper)throw Error("Invalid outputUpper formatting option");if("string"!==typeof a.b64Pad)throw Error("Invalid b64Pad formatting option");return a}function H(b,a,d){switch(a){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");
}switch(b){case "HEX":b=function(a,c,b){var e=a.length,g,f;if(0!==e%2)throw Error("String of HEX type must be in byte increments");c=c||[0];b=b||0;var m=b>>>3;var l=-1===d?3:0;for(g=0;g<e;g+=2){var t=parseInt(a.substr(g,2),16);if(isNaN(t))throw Error("String of HEX type contains invalid characters");var n=(g>>>1)+m;for(f=n>>>2;c.length<=f;)c.push(0);c[f]|=t<<8*(l+n%4*d)}return{value:c,binLen:4*e+b}};break;case "TEXT":b=function(b,c,f){var e=0,g,h,m;c=c||[0];f=f||0;var l=f>>>3;if("UTF8"===a){var t=
-1===d?3:0;for(g=0;g<b.length;g+=1){var n=b.charCodeAt(g);var q=[];128>n?q.push(n):2048>n?(q.push(192|n>>>6),q.push(128|n&63)):55296>n||57344<=n?q.push(224|n>>>12,128|n>>>6&63,128|n&63):(g+=1,n=65536+((n&1023)<<10|b.charCodeAt(g)&1023),q.push(240|n>>>18,128|n>>>12&63,128|n>>>6&63,128|n&63));for(h=0;h<q.length;h+=1){var k=e+l;for(m=k>>>2;c.length<=m;)c.push(0);c[m]|=q[h]<<8*(t+k%4*d);e+=1}}}else if("UTF16BE"===a||"UTF16LE"===a)for(t=-1===d?2:0,q="UTF16LE"===a&&1!==d||"UTF16LE"!==a&&1===d,g=0;g<b.length;g+=
1){n=b.charCodeAt(g);!0===q&&(h=n&255,n=h<<8|n>>>8);k=e+l;for(m=k>>>2;c.length<=m;)c.push(0);c[m]|=n<<8*(t+k%4*d);e+=2}return{value:c,binLen:8*e+f}};break;case "B64":b=function(a,c,b){var e=0,g,f;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");var m=a.indexOf("=");a=a.replace(/=/g,"");if(-1!==m&&m<a.length)throw Error("Invalid '=' found in base-64 string");c=c||[0];b=b||0;var k=b>>>3;var l=-1===d?3:0;for(m=0;m<a.length;m+=4){var n=a.substr(m,4);for(g=f=0;g<
n.length;g+=1){var q="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(n[g]);f|=q<<18-6*g}for(g=0;g<n.length-1;g+=1){var u=e+k;for(q=u>>>2;c.length<=q;)c.push(0);c[q]|=(f>>>16-8*g&255)<<8*(l+u%4*d);e+=1}}return{value:c,binLen:8*e+b}};break;case "BYTES":b=function(a,c,b){var e;c=c||[0];b=b||0;var g=b>>>3;var f=-1===d?3:0;for(e=0;e<a.length;e+=1){var m=a.charCodeAt(e);var k=e+g;var l=k>>>2;c.length<=l&&c.push(0);c[l]|=m<<8*(f+k%4*d)}return{value:c,binLen:8*a.length+b}};break;
case "ARRAYBUFFER":try{b=new ArrayBuffer(0)}catch(e){throw Error("ARRAYBUFFER not supported by this environment");}b=function(a,b,f){var c;b=b||[0];f=f||0;var e=f>>>3;var h=-1===d?3:0;var m=new Uint8Array(a);for(c=0;c<a.byteLength;c+=1){var l=c+e;var k=l>>>2;b.length<=k&&b.push(0);b[k]|=m[c]<<8*(h+l%4*d)}return{value:b,binLen:8*a.byteLength+f}};break;default:throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");}return b}function k(b,a){return b>>>a|b<<32-a}function O(b,a,d){return b&
a^~b&d}function P(b,a,d){return b&a^b&d^a&d}function Q(b){return k(b,2)^k(b,13)^k(b,22)}function R(b){return k(b,6)^k(b,11)^k(b,25)}function S(b){return k(b,7)^k(b,18)^b>>>3}function T(b){return k(b,17)^k(b,19)^b>>>10}function U(b,a){var d=(b&65535)+(a&65535);return((b>>>16)+(a>>>16)+(d>>>16)&65535)<<16|d&65535}function V(b,a,d,e){var c=(b&65535)+(a&65535)+(d&65535)+(e&65535);return((b>>>16)+(a>>>16)+(d>>>16)+(e>>>16)+(c>>>16)&65535)<<16|c&65535}function W(b,a,d,e,c){var f=(b&65535)+(a&65535)+(d&
65535)+(e&65535)+(c&65535);return((b>>>16)+(a>>>16)+(d>>>16)+(e>>>16)+(c>>>16)+(f>>>16)&65535)<<16|f&65535}function y(b){if(0===b.lastIndexOf("SHA-",0)){var a=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428];var d=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];switch(b){case "SHA-224":b=a;break;case "SHA-256":b=d;break;case "SHA-384":b=[new l(3418070365,a[0]),new l(1654270250,a[1]),new l(2438529370,a[2]),new l(355462360,
a[3]),new l(1731405415,a[4]),new l(41048885895,a[5]),new l(3675008525,a[6]),new l(1203062813,a[7])];break;case "SHA-512":b=[new l(d[0],4089235720),new l(d[1],2227873595),new l(d[2],4271175723),new l(d[3],1595750129),new l(d[4],2917565137),new l(d[5],725511199),new l(d[6],4215389547),new l(d[7],327033209)];break;default:throw Error("Unknown SHA variant");}}else throw Error("No SHA variants supported");return b}function B(b,a,d){var e,c=[];if("SHA-224"===d||"SHA-256"===d){var f=64;var k=1;var g=Number;
var h=U;var m=V;var l=W;var t=S;var n=T;var q=Q;var u=R;var y=P;var r=O;var B=X}else throw Error("Unexpected error in SHA-2 implementation");d=a[0];var v=a[1];var A=a[2];var F=a[3];var z=a[4];var C=a[5];var x=a[6];var G=a[7];for(e=0;e<f;e+=1){if(16>e){var w=e*k;var D=b.length<=w?0:b[w];w=b.length<=w+1?0:b[w+1];c[e]=new g(D,w)}else c[e]=m(n(c[e-2]),c[e-7],t(c[e-15]),c[e-16]);D=l(G,u(z),r(z,C,x),B[e],c[e]);w=h(q(d),y(d,v,A));G=x;x=C;C=z;z=h(F,D);F=A;A=v;v=d;d=h(D,w)}a[0]=h(d,a[0]);a[1]=h(v,a[1]);a[2]=
h(A,a[2]);a[3]=h(F,a[3]);a[4]=h(z,a[4]);a[5]=h(C,a[5]);a[6]=h(x,a[6]);a[7]=h(G,a[7]);return a}var X=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,
2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];"function"===typeof define&&define.amd?define(function(){return u}):"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(module.exports=u),exports=u):N.jsSHA=u})(this);
