//https://imagej.nih.gov/ij/developer/source/ij/process/FHT.java.html



function fht(img, copy=true){// boolean inverse, int maxN) {

  let x = img.raster.pixelData;
  var maxN = x.length;
  



//initialize table
  var n = maxN/4;
  var co=[] ; var si=[] ;
  var theta = 0.0;
  var dTheta = 2.0 * Math.PI/maxN;
  for (let i=0; i<n; i++) {
    co[i] = Math.cos(theta);
    si[i] = Math.sin(theta);
    theta += dTheta;}

  for (var row=0; row<maxN; row++){
       dfht3(x, row*maxN, maxN, co, si);}

  transposeR(x, maxN);

   for (var row=0; row<maxN; row++){
     dfht3(x, row*maxN, maxN, co, si);}
   transposeR(x, maxN);

  for ( row=0; row<=maxN/2; row++) { // Now calculate actual Hartley transform
     for (var col=0; col<=maxN/2; col++) {
        var mRow = (maxN - row) % maxN;
        var mCol = (maxN - col)  % maxN;
        var A = x[row * maxN + col];	//  see Bracewell, 'Fast 2D Hartley Transf.' IEEE Procs. 9/86
        var B = x[mRow * maxN + col];
        var C = x[row * maxN + mCol];
        var D = x[mRow * maxN + mCol];
        var E = ((A + D) - (B + C)) / 2;
        x[row * maxN + col] = A - E;
        x[mRow * maxN + col] = B + E;
        x[row * maxN + mCol] = C + E;
        x[mRow * maxN + mCol] = D - E;
    }
  }
  return img;
}
function transposeR (x, maxN) {
		var r; var c;var rTemp;
		for (r=0; r<maxN; r++)  {
			for (c=r; c<maxN; c++) {
				if (r != c)  {
					rTemp = x[r*maxN + c];
					x[r*maxN + c] = x[c*maxN + r];
					x[c*maxN + r] = rTemp;
				}
			}
		}
	}

 function dfht3( x, base, maxN, co, si) {
  var Ad0; var Ad1; var Ad2; var Ad3; var Ad4; var CSAd;
  var rt1; var rt2; var rt3; var rt4;

  // if (S==null) initializeTables(maxN);
  var Nlog2 = Math.log2(maxN);
  BitRevRArr(x, base, Nlog2, maxN);	//bitReverse the input array
  var gpSize = 2;     //first & second stages - do radix 4 butterflies once thru
  var numGps = maxN / 4;
  for (let gpNum=0; gpNum<numGps; gpNum++)  {
    Ad1 = gpNum * 4;
    Ad2 = Ad1 + 1;
    Ad3 = Ad1 + gpSize;
    Ad4 = Ad2 + gpSize;
    rt1 = x[base+Ad1] + x[base+Ad2];   // a + b
    rt2 = x[base+Ad1] - x[base+Ad2];   // a - b
    rt3 = x[base+Ad3] + x[base+Ad4];   // c + d
    rt4 = x[base+Ad3] - x[base+Ad4];   // c - d
    x[base+Ad1] = rt1 + rt3;      // a + b + (c + d)
    x[base+Ad2] = rt2 + rt4;      // a - b + (c - d)
    x[base+Ad3] = rt1 - rt3;      // a + b - (c + d)
    x[base+Ad4] = rt2 - rt4;      // a - b - (c - d)
   }

  if (Nlog2 > 2) {
     // third + stages computed here
    gpSize = 4;
    numBfs = 2;
    numGps = numGps / 2;
    //IJ.write("FFT: dfht3 "+Nlog2+" "+numGps+" "+numBfs);
    for (var stage=2; stage<Nlog2; stage++) {
      for (gpNum=0; gpNum<numGps; gpNum++) {
        Ad0 = gpNum * gpSize * 2;
        Ad1 = Ad0;     // 1st butterfly is different from others - no mults needed
        Ad2 = Ad1 + gpSize;
        Ad3 = Ad1 + gpSize / 2;
        Ad4 = Ad3 + gpSize;
        rt1 = x[base+Ad1];
        x[base+Ad1] = x[base+Ad1] + x[base+Ad2];
        x[base+Ad2] = rt1 - x[base+Ad2];
        rt1 = x[base+Ad3];
        x[base+Ad3] = x[base+Ad3] + x[base+Ad4];
        x[base+Ad4] = rt1 - x[base+Ad4];
        for (bfNum=1; bfNum<numBfs; bfNum++) {
        // subsequent BF's dealt with together
          Ad1 = bfNum + Ad0;
          Ad2 = Ad1 + gpSize;
          Ad3 = gpSize - bfNum + Ad0;
          Ad4 = Ad3 + gpSize;

          CSAd = bfNum * numGps;
          rt1 = x[base+Ad2] * co[CSAd] + x[base+Ad4] * si[CSAd];
          rt2 = x[base+Ad4] * co[CSAd] - x[base+Ad2] * si[CSAd];

          x[base+Ad2] = x[base+Ad1] - rt1;
          x[base+Ad1] = x[base+Ad1] + rt1;
          x[base+Ad4] = x[base+Ad3] + rt2;
          x[base+Ad3] = x[base+Ad3] - rt2;

        } /* end bfNum loop */
      } /* end gpNum loop */
      gpSize *= 2;
      numBfs *= 2;
      numGps = numGps / 2;
    } /* end for all stages */
  }/* end if Nlog2 > 2 */
   for (let i=0; i<maxN; i++){
     x[base+i] = x[base+i] / maxN;
 }
}

 function BitRevRArr (x, base, bitlen, maxN) {
   //make bit reverse table
   var nLog2 = Math.log2(maxN);
   var bitrev=[];
   var tempArr=[];
   for (let i=0; i<maxN; i++){
     bitrev[i] = bitRevX(i, nLog2);}
    //bitRevArr
 		for (let i=0; i<maxN; i++){
       tempArr[i] = x[base+bitrev[i]];
     }
 		for (let i=0; i<maxN; i++){
       x[base+i] = tempArr[i];
     }
   }
   function bitRevX (x, bitlen) {
		var  temp = 0;
		for (let i=0; i<=bitlen; i++)
			if ((x & (1<<i)) !=0)
				temp  |= (1<<(bitlen-i-1));
		return temp;
	}