function fft(pixelData, copy=true)
{
	
	var N = pixelData.length;
	// console.log(N);
	if( N <= 1 ){
		return pixelData;
	}
	var hN = N / 2;
	var even = new Array();
	var odd = new Array();

	for(var i = 0; i < hN; ++i)
	{
		even[i] = pixelData[i*2];
		odd[i] = pixelData[i*2+1];
	}
	even = cfft(even);
	odd = cfft(odd);
 
	var a = -2*Math.PI;
	for(var k = 0; k < hN; ++k)
	{
		if(!(even[k] instanceof Complex))
			even[k] = new Complex(even[k], 0);
		if(!(odd[k] instanceof Complex))
			odd[k] = new Complex(odd[k], 0);
		var p = k/N;
		var t = new Complex(0, a * p);
		t.cexp(t).mul(odd[k], t);
		pixelData[k] = even[k].add(t, odd[k]);
		pixelData[k + hN] = even[k].sub(t, even[k]);
		
	}
	console.log(pixelData)
	return pixelData[0];

}
function inverse(pixelData)
{
	var N = pixelData.length;
	var iN = 1 / N;
 
	//conjugate if imaginary part is not 0
	for(var i = 0 ; i < N; ++i)
		if(pixelData[i] instanceof Complex)
			pixelData[i].im = -pixelData[i].im;
 
	//apply fourier transform
	pixelData = cfft(pixelData)
 
	for(var i = 0 ; i < N; ++i)
	{
		//conjugate again
		pixelData[i].im = -pixelData[i].im;
		//scale
		pixelData[i].re *= iN;
		pixelData[i].im *= iN;
	}
	return pixelData;
}
