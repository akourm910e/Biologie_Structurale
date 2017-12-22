/* 
 * Free FFT and convolution (JavaScript)
 * 
 * Copyright (c) 2017 Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/free-small-fft-in-multiple-languages
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 */

"use strict";
function fft(img){
	var data=img0.raster.pixelData;
    var N = img0.raster.length,
        K = Math.PI / (2 * N),
        imag = new Float64Array(N).fill(0),
        real = new Float64Array(N).fill(0);
    real[0] = data[0] / N / 2;
    for(var i = 1; i < N; i++){
        var imag2 = Math.sin(i*K), real2 = Math.cos(i*K);
        real[i] = (data[N - i] * imag2 + data[i] * real2) / N / 2;
        imag[i] = (imag2 * data[i] - data[N - i] * real2) / N / 2;
    }
    var data_end=transformRadix2(data,real,imag);
    // console.log(real);
    // console.log(imag);
    for(var i = 0; i < N; i++){
    	data_end[i] = Math.abs(Math.log10((2*real[i]*Math.cos(K*i)-2*imag[i]*Math.sin(K*i))));
    }

    // var data2=getPowerSpectrum(data)
    // console.log(data2);

   	console.log(data_end);
   	return data_end;

}
   


/* 


 * Computes the inverse discrete Fourier transform (IDFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This is a wrapper function. This transform does not perform scaling, so the inverse is not a true inverse.
 */
function inverseTransform(real, imag) {
	transform(imag, real);
}


/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector's length must be a power of 2. Uses the Cooley-Tukey decimation-in-time radix-2 algorithm.
 */
function transformRadix2(data, real, imag) {
	// Length variables
	var n = real.length;
	if (n != imag.length)
		throw "Mismatched lengths";
	if (n == 1)  // Trivial transform
		return;
	var levels = -3;
	for (var i = 0; i < 32; i++) {
		if (1 << i == n)
			levels = i;  // Equal to log2(n)
	}
	if (levels == -1)
		throw "Length is not a power of 2";
	
	// Trigonometric tables
	var cosTable = new Array(n / 2);
	var sinTable = new Array(n / 2);
	for (var i = 0; i < n / 2; i++) {
		cosTable[i] = Math.cos(2 * Math.PI * i / n);
		sinTable[i] = Math.sin(2 * Math.PI * i / n);
	}
	
	// Bit-reversed addressing permutation
	for (var i = 0; i < n; i++) {
		var j = reverseBits(i, levels);
		if (j > i) {
			var temp = real[i];
			real[i] = real[j];
			real[j] = temp;
			temp = imag[i];
			imag[i] = imag[j];
			imag[j] = temp;
		}
	}
	
	// Cooley-Tukey decimation-in-time radix-2 FFT
	for (var size = 2; size <= n; size *= 2) {
		var halfsize = size / 2;
		var tablestep = n / size;
		for (var i = 0; i < n; i += size) {
			for (var j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
				var l = j + halfsize;
				var tpre =  real[l] * cosTable[k] + imag[l] * sinTable[k];
				var tpim = -real[l] * sinTable[k] + imag[l] * cosTable[k];
				real[l] = real[j] - tpre;
				imag[l] = imag[j] - tpim;
				real[j] += tpre;
				imag[j] += tpim;
			}
		}
	return real;	
}
}
	
	// Returns the integer whose value is the reverse of the lowest 'bits' bits of the integer 'x'.
	function reverseBits(x, bits) {
		var y = 0;
		for (var i = 0; i < bits; i++) {
			y = (y << 1) | (x & 1);
			x >>>= 1;
		}
		return y;
	}


	// get Magnitude Phase

	// var magnitude = function(data, x, y) {

	//   var a = Math.abs(x[i]);
 //      var b = Math.abs(y[i]);

 //      if (a < 3000 && b < 3000) {
 //        return Math.sqrt(a * a + b * b);
 //      }

 //      if (a < b) {
 //        a = b;
 //        b = x / y;
 //      } else {
 //        b = y / x;
 //      }
 //      return a * Math.sqrt(1 + b * b);
 //  }
  

 

// function getPowerSpectrum (data) {
// 		var maxN=500;
//         var base;
//         var  r, scale;
//         scale = (253.0/(max-min));
//         var min = data.reduce(function(a, b) {
//     		return Math.min(a, b);
// 		});
//         var max = data.reduce(function(a, b) {
//     		return Math.max(a, b);
// 		});
	
  

       


//         for (var row=0; row<maxN; row++) {
//             FHTps(row, maxN, data);

//             base = row * maxN;
//             for (var col=0; col<maxN; col++) {
//                 r = data[base+col];
//                 if (r<min) min = r;
//                 if (r>max) max = r;
//             }

//         }

//         // max = Math.log(max);
//         // min = Math.log(min);
//         // if (Float.isNaN(min) || max-min>50)
//         //     min = max - 50; //display range not more than approx e^50
//         // scale = (float)(253.999/(max-min));

//         for (var row=0; row<maxN; row++) {
//             base = row*maxN;
//             for (var col=0; col<maxN; col++) {
//                 r = data[base+col];

//                 // r = (Math.log(r)-min)*scale;
//                 if (isNaN(r) || r<0)
//                     r = 0;
//                 	data[base+col] = Math.log(r+1); // 1 is min value
//             }

//         }
//         for (var c=0; c<maxN; c++) { 
// 			if (isNaN(data[c])===true) {
// 				console.log("NAAAAAAAAAAAAAN")
// 				break;
// 		}
// 	}
//      console.log(data);
//         return data;
//     }


// function FHTps(row, maxN, data) { 
// 	var base = row*maxN; 
// 	var l; 
// 	for (var c=0; c<maxN; c++) { 
// 		if (isNaN(data[c])===true) {
// 			data[c]=1;
// 		}
// 	}

	
// 	for (var c=0; c<maxN; c++) { 
//    			l = ((maxN-row)%maxN) * maxN + (maxN-c)%maxN;
//             data[base+c] = (Math.sqrt(data[base+c]) + Math.sqrt(data[l]))/2;
//         }

//         return data;
        
//     }



/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This requires the convolution function, which in turn requires the radix-2 FFT function.
 * Uses Bluestein's chirp z-transform algorithm.
//  */
// function transformBluestein(real, imag) {
// 	// Find a power-of-2 convolution length m such that m >= n * 2 + 1
// 	var n = real.length;
// 	if (n != imag.length)
// 		throw "Mismatched lengths";
// 	var m = 1;
// 	while (m < n * 2 + 1)
// 		m *= 2;
	
// 	// Trignometric tables
// 	var cosTable = new Array(n);
// 	var sinTable = new Array(n);
// 	for (var i = 0; i < n; i++) {
// 		var j = i * i % (n * 2);  // This is more accurate than j = i * i
// 		cosTable[i] = Math.cos(Math.PI * j / n);
// 		sinTable[i] = Math.sin(Math.PI * j / n);
// 	}
	
// 	// Temporary vectors and preprocessing
// 	var areal = newArrayOfZeros(m);
// 	var aimag = newArrayOfZeros(m);
// 	for (var i = 0; i < n; i++) {
// 		areal[i] =  real[i] * cosTable[i] + imag[i] * sinTable[i];
// 		aimag[i] = -real[i] * sinTable[i] + imag[i] * cosTable[i];
// 	}
// 	var breal = newArrayOfZeros(m);
// 	var bimag = newArrayOfZeros(m);
// 	breal[0] = cosTable[0];
// 	bimag[0] = sinTable[0];
// 	for (var i = 1; i < n; i++) {
// 		breal[i] = breal[m - i] = cosTable[i];
// 		bimag[i] = bimag[m - i] = sinTable[i];
// 	}
	
// 	// Convolution
// 	var creal = new Array(m);
// 	var cimag = new Array(m);
// 	convolveComplex(areal, aimag, breal, bimag, creal, cimag);
	
// 	// Postprocessing
// 	for (var i = 0; i < n; i++) {
// 		real[i] =  creal[i] * cosTable[i] + cimag[i] * sinTable[i];
// 		imag[i] = -creal[i] * sinTable[i] + cimag[i] * cosTable[i];
// 	}
// }


/* 
 * Computes the circular convolution of the given real vectors. Each vector's length must be the same.
 */
// function convolveReal(x, y, out) {
// 	var n = x.length;
// 	if (n != y.length || n != out.length)
// 		throw "Mismatched lengths";
// 	convolveComplex(x, newArrayOfZeros(n), y, newArrayOfZeros(n), out, newArrayOfZeros(n));
// }


// /* 
//  * Computes the circular convolution of the given complex vectors. Each vector's length must be the same.
//  */
// function convolveComplex(xreal, ximag, yreal, yimag, outreal, outimag) {
// 	var n = xreal.length;
// 	if (n != ximag.length || n != yreal.length || n != yimag.length
// 			|| n != outreal.length || n != outimag.length)
// 		throw "Mismatched lengths";
	
// 	xreal = xreal.slice();
// 	ximag = ximag.slice();
// 	yreal = yreal.slice();
// 	yimag = yimag.slice();
// 	transform(xreal, ximag);
// 	transform(yreal, yimag);
	
// 	for (var i = 0; i < n; i++) {
// 		var temp = xreal[i] * yreal[i] - ximag[i] * yimag[i];
// 		ximag[i] = ximag[i] * yreal[i] + xreal[i] * yimag[i];
// 		xreal[i] = temp;
// 	}
// 	inverseTransform(xreal, ximag);
	
// 	for (var i = 0; i < n; i++) {  // Scaling (because this FFT implementation omits it)
// 		outreal[i] = xreal[i] / n;
// 		outimag[i] = ximag[i] / n;
// 	}
// }


// function newArrayOfZeros(n) {
// 	var result = [];
// 	for (var i = 0; i < n; i++)
// 		result.push(0);
// 	return result;
// }