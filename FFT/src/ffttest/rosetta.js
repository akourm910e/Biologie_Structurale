function icfft(img)
{
	var N = img.raster.length;
	var iN = 1 / N;
 
	//conjugate if imaginary part is not 0
	for(var i = 0 ; i < N; ++i)
		if(img[i] instanceof Complex)
			img[i].im = -img[i].im;
 
	//apply fourier transform
	img = cfft(img)
 
	for(var i = 0 ; i < N; ++i)
	{
		//conjugate again
		img[i].im = -img[i].im;
		//scale
		img[i].re *= iN;
		img[i].im *= iN;
	}
	return img;
}
 
function cfft(img)
{

	var N = img.length;
	
	// console.log(N);
	if( N <= 1 )
		return img;
 
	var hN = N / 2;

	var even = img;
	var odd = img;
	for(var i = 0; i < hN; ++i)
	{
		even[i] = img[i*2];
		odd[i] = img[i*2+1];
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
		img[k] = even[k].add(t, odd[k]);
		img[k + hN] = even[k].sub(t, even[k]);
	}
	return img;
	
}