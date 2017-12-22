function miniDCT(s){
    var N = s.length,
        K = -Math.PI / (2 * N),
        re = new Float64Array(N),
        im = new Float64Array(N);
    for(var i = 0, j = N; j > i; i++){
        re[i] = s[i * 2]
        re[--j] = s[i * 2 + 1]
    }
    miniFFT(re, im)
    for(var i = 0; i < N; i++)
        s[i] = 2*re[i]*Math.cos(K*i)-2*im[i]*Math.sin(K*i);
}
