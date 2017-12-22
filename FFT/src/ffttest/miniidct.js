function miniIDCT(s){
    var N = s.length,
        K = Math.PI / (2 * N),
        im = new Float64Array(N),
        re = new Float64Array(N);
    re[0] = s[0] / N / 2;
    for(var i = 1; i < N; i++){
        var im2 = Math.sin(i*K), re2 = Math.cos(i*K);
        re[i] = (s[N - i] * im2 + s[i] * re2) / N / 2;
        im[i] = (im2 * s[i] - s[N - i] * re2) / N / 2;
    }
    miniFFT(im, re)
    for(var i = 0; i < N / 2; i++){
        s[2 * i] = re[i]
        s[2 * i + 1] = re[N - i - 1]
    }
}