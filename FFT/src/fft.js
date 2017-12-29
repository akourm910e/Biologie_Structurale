/*
 *  times: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of times
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with times.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Antoine Kourmanalieva
 * Ninon de Mecquenem
 * Leo Grosjean
 * 
 *
 * Jean-Christophe Taveau
 */



/**
 * Fast Fourier Transform Based on cooley and tukey algorithm (Radix2 DIT)
 * 
 * fft() -- perform fft
 *
 * @param {raster} raster - Input raster
 * @return {array} pixelData - output array 
 *
 * @author Antoine Kourmanalieva
 */

function fft(raster, copy=true)
{
	var pixelData = raster;
									  // get pixel values array
	var N = pixelData.length; 			      		// get pixel value array length
	if( N <= 1 ){
		return pixelData;
	}
	let hN = N / 2;
	let even = new Array();
	let odd = new Array();

	for(let i = 0; i < hN; ++i)
	{
		even[i] = pixelData[i*2];
		odd[i] = pixelData[i*2+1];
	}
	even = fft(even);
	odd = fft(odd);
 
	let a = -2*Math.PI;
	for(let k = 0; k < hN; ++k)
	{
		if(!(even[k] instanceof Complex))
			even[k] = new Complex(even[k], 0);
		if(!(odd[k] instanceof Complex))
			odd[k] = new Complex(odd[k], 0);
		let p = k/N;
		let t = new Complex(0, a * p);
		t.cexp(t).mul(odd[k], t);
		pixelData[k] = even[k].add(t, odd[k]);
		pixelData[k + hN] = even[k].sub(t, even[k]);
		
	}
	// console.log(pixelData);
	inverse(pixelData); // [0] -- REAL VALUE / [1] -- IMAGINARY VALUE 
// 
}
/**
 * Fast Fourier Transform Based on cooley and tukey algorithm 
 * 
 * inverse() -- perform inverse of fft
 *
 * @param {raster} raster - Input raster
 * @return {array} pixelData - output array 
 *
 * @author Antoine Kourmanalieva
 */

function inverse(pixelData, copy=true)
{
	let N = pixelData.length;
	let iN = 1 / N;
 
	//conjugate if imaginary part is not 0
	for(let i = 0 ; i < N; ++i)
		if(pixelData[i] instanceof Complex)
			pixelData[i].im = -pixelData[i].im;
 
	//apply fourier transform
	pixelData = fft(pixelData)
 
	for(let i = 0 ; i < N; ++i)
	{
		//conjugate again
		pixelData[i].im = -pixelData[i].im;
		//scaled
		pixelData[i].re *= iN;
		pixelData[i].im *= iN;
	}
	console.log(pixelData)
	return pixelData;
}

function getMagnitude(){
	for (let i; i<hN; i++){
		let magnitude = 20 * Math.Log(Math.sqrt(Math.pow(Re) + Math.pow(Im)));
	}
	return magnitude

}
