# MiniFFT

MiniFFT takes two arrays (real, imag) as arguments and transforms them in-place. It only works for arrays which are powers-of-two, and imag and real must be the same length.

    var re = [1, 2, 3, 4],
        im = [0, 0, 0, 0];
    miniFFT(re, im);
    console.log(re, im); // [ 10, -2, -2, -1.9999999999999998 ] [ 0, 2, 0, -2 ]
    
The minified version (minifft.min.js) is only 359 bytes in length. 

The implementation is based loosely on http://introcs.cs.princeton.edu/java/97data/InplaceFFT.java.html and http://www.nayuki.io/res/free-small-fft-in-multiple-languages/fft.js

Unlike https://gist.github.com/wrayal/995571, it doesn't need a special complex number library (so that one's closer to 542b+139b). It's also using a non-recursive variant of Cooley-Tukey which has to mean something— right? 

# MiniDCT

This is an implementation of a Type-II DCT using MiniFFT. For details about Makhoul's algorithm, see this post http://dsp.stackexchange.com/a/10606

It's surprisingly hard to find an implementation of the DCT which isn't using the naive O(n^2) approach.

Like MiniFFT, it operates in-place (well, not really, but it writes its output to the source array). 

    var arr = [3, 4, 1, 7];
    miniDCT(arr);
    console.log(arr); // [ 30, -5.094935665899755, 7.0710678118654755, -8.604744653988439 ]

It produces the same output as scipy's fftpack, but Matlab's DCT uses orthogonal normalization and produces a different result. However, it's pretty simple to do it the Matlab way— just scale everything by 1/sqrt(2 * N) and divide the first element by sqrt(2).

# MiniIDCT

What DCT is complete without a corresponding IDCT? Here's an implementation of the Type-III DCT (aka the venerable IDCT), modeled after http://www.idlcoyote.com/tip_examples/idct.pro. The awkwardness of this name really almost compels me to rename these functions from Mini to Tiny.