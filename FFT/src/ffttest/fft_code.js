//   fft.cpp - impelementation of class
//   of fast Fourier transform - FFT
//
//   The code is property of LIBROW
//   You can use it on your own
//   When utilizing credit LIBROW site

//   Include declaration file

//   Include math library


//   FORWARD FOURIER TRANSFORM
//     Input  - Input Inp
//     Output - transform result



function forward(Input, N)
{
	N=Input.raster.length;
	//   Check Input parameters
	// if (!Input || !Output || N < 1 || N & (N - 1)){
	// 	return false;
	// }
	//   Initialize Inp
	rearange(Input, N);
	//   Call FFT implementation
	perform(Input, N);
	//   Succeeded

}

//   FORWARD FOURIER TRANSFORM, InpLACE VERSION
//     Inp - both Input Inp and output
//     N    - length of Input Inp


//   INVERSE FOURIER TRANSFORM
//     Input  - Input Inp
//     Output - transform result
//     N      - length of both Input Inp and result
//     Scale  - if to scale result
function inverse(Input,N)
{
	//   Check Input parameters
	// if (!Input || !Output || N < 1 || N & (N - 1)){
	// 	return false;
	// }
	//   Initialize Inp
	rearange(Input, N);
	//   Call FFT implementation
	perform(Input,N);
	//   Scale if necessary

	return true;
}

//   INVERSE FOURIER TRANSFORM, InpLACE VERSION
//     Inp  - both Input Inp and output
//     N     - length of both Input Inp and result
//     Scale - if to scale result





//   Inplace version of rearange function
function rearange(Input, N)
{
	//   Swap position
	var target = 0;
	//   Process all positions of Input signal
	for (var position = 0; position < N; ++position)
	{
		//   Only for not yet swapped entries
		if (target > position)
		{
			//   Swap entries
			var temp=new Complex(Input[target]);
			Input[target] = Input[position];
			Input[position] = temp;
		}
		//   Bit mask
		var mask = N;
		//   While bit is set
		while (target & (mask >>= 1))
			//   Drop bit
			target &= ~mask;
		//   The current bit is 0 - set it
		target |= mask;
	}
}

//   FFT implementation
function perform(Input, N)
{
	var pi = inverse ? 3.14159265358979323846 : -3.14159265358979323846;
	//   Iteration through dyads, quadruples, octads and so on...
	for (var step = 1; step < N; step <<= 1)
	{
		//   Jump to the next entry of the same transform factor
		var jump = step << 1;
		//   Angle increment
		var delta = pi /(step);
		//   Auxiliary sin(delta / 2)
		var sine = Math.sin(delta * .5);
		//   Multiplier for trigonometric recurrence
		var mul=new Complex(-2. * sine * sine, Math.sin(delta));
		//   Start value for transform factor, fi = 0
		var factor = new Complex(1.);
		//   Iteration through groups of different transform factor
		for (var group = 0; group < step; ++group)
		{
			//   Iteration within group 
			for (var pair = group; pair < N; pair += jump)
			{
				//   Match position
				var match = pair + step;
				//   Second term of two-point transform
				var product = new Complex(factor * Input[match]);
				//   Transform for fi + pi
				Input[match] = Input[pair] - product;
				//   Transform for fi
				Input[pair] += product;
			}
			//   Successive transform factor via trigonometric recurrence
			factor = mul * factor + factor;
		}
	}
	console.log(factor)
}

//   Scaling of inverse FFT result
function scale(Input)
{
	var Factor = 1. /(N);
	//   Scale all Inp entries
	for (var position = 0; position < N; ++position)
		Input[position] *= factor;
}
