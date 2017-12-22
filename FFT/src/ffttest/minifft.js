
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
    for(var i = 0; i < N/2; i++){
        s[i] = 2*re[i]*Math.cos(K*i)-2*im[i]*Math.sin(K*i);
    }
    // console.log(s);
    return s;
    // return computePowerSpectrum(s);
}


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
    return s;
}


function miniFFT(re, im) {
    var N = re.length;
    for (var i = 0; i < N; i++) {
        for(var j = 0, h = i, k = N; k >>= 1; h >>= 1)
            j = (j << 1) | (h & 1);
        if (j > i) {
            re[j] = [re[i], re[i] = re[j]][0]
            im[j] = [im[i], im[i] = im[j]][0]
        }
    }
    for(var hN = 1; hN * 2 <= N; hN *= 2)
        for (var i = 0; i < N; i += hN * 2)
            for (var j = i; j < i + hN; j++) {
                var cos = Math.cos(Math.PI * (j - i) / hN),
                    sin = Math.sin(Math.PI * (j - i) / hN)
                var tre =  re[j+hN] * cos + im[j+hN] * sin,
                    tim = -re[j+hN] * sin + im[j+hN] * cos;
                re[j + hN] = re[j] - tre; im[j + hN] = im[j] - tim;
                re[j] += tre; im[j] += tim;
            }
}


// function computePowerSpectrum(power)
//     {
//         var complex = power.length / 200;

//         var powerSpectrum = power;

//         for (var pos = 0; pos < complex; pos++){
//             powerSpectrum[pos] = Math.sqrt(Math.pow(complex[pos*2],2) + Math.pow(complex[pos*2 + 1],2));
//         }
    
//         console.log(powerSpectrum)
//         return powerSpectrum;

//     }
// function computeComplexValues(float[] power, float[] phase)
//     {
//         if (power.length != phase.length)
//         {
//             System.err.println("Power and Phase Spectrum are not of same size.");
//             return null;
//         }
        
//         float[] complex = new float[power.length * 2];
        
//         for (int pos = 0; pos < power.length; pos++)
//         {
//             if (power[pos] == 0)
//             {
//                 complex[pos*2] = 0;
//                 complex[pos*2+1] = 0;
//             }
//             else
//             {
//                 complex[pos*2] = (float)(Math.cos(phase[pos]) * power[pos]);
//                 complex[pos*2 + 1] = (float)(Math.sin(phase[pos]) * power[pos]);
//             }
//         }
            
        
//         return complex;
//     }