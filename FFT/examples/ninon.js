function dfht(fht) {
  //IJ.write("fft: "+inverse);
  //new ImagePlus("Input", ip.crop()).show();
  var maxN = 360;
//  makeSinCosTables(maxN); ci dessous
    var n = maxN/4;
    co = (new Array(n)).fill(0);
    si = (new Array(n)).fill(0);
    var theta = 0.0;
    var dTheta = 2.0 * Math.PI/maxN;
    for (let i=0; i<n; i++) {
      co[i] = Math.cos(theta);
      si[i] = Math.sin(theta);
      theta += dTheta;
    }
    console.log(co);
    console.log(si);



  // var fht = img.raster.pixelData;

  rc2DFHT(fht, maxN, co, si);
  // if (inverse) {
  //   ip.resetMinAndMa);
  //   new ImagePlus(imp.getTitle(), ip).show();
  // } else {
  calculatePowerSpectrum(fht, maxN); //-> ne change rien !!!
    // ImagePlus imp = new ImagePlus("FFT", ps);
    // imp.setProperty("FHT", ip);
    // imp.show();
console.log(fht);
    // if (IJ.altKeyDown()) {
    //   ImageProcessor amp = calculateAmplitude(fht, maxN);
    //   new ImagePlus("Amplitude", amp).show();
    // }
    return fht;
}


function rc2DFHT(x, maxN, co, si) {
  //console.log(x);
  //IJ.write("FFT: rc2DFHT (row-column Fast Hartley Transform)");
  for (let row=0; row<maxN/2; row++){dfht3(x, row*maxN, maxN, co, si);}
  transposeR(x, maxN);
  for (let row=0; row<maxN; row++){dfht3(x, row*maxN, maxN, co, si);}
  transposeR(x, maxN);

  var mRow; var mCol;
  var A; var B; var C; var D; var E;
  for (var row=0; (row<(maxN/2)); row++) { // Now calculate actual Hartley transform
    for (var col=0; (col<(maxN/2)); col++) {
      mRow = (maxN - row) % maxN;
      mCol = (maxN - col)  % maxN;
      A = x[row * maxN + col];    //  see Bracewell, 'Fast 2D Hartley Transf.' IEEE Procs. 9/86
      B = x[mRow * maxN + col];
      C = x[row * maxN + mCol];
      D = x[mRow * maxN + mCol];
      E = ((A + D) - (B + C)) / 2;
      x[row * maxN + col] = A - E;
      x[mRow * maxN + col] = B + E;
      x[row * maxN + mCol] = C + E;
      x[mRow * maxN + mCol] = D - E;
    }
  }
}

function calculatePowerSpectrum (fht, maxN) {
  var base;
  var  r; var scale;
  var min = Number.MAX_VALUE;
  var max = Number.MIN_VALUE;
  var fps = (new Array(maxN*maxN)).fill(0);
  var ps = (new Array(maxN*maxN)).fill(0);

    for (let row=0; row<maxN; row++) {
    FHTps(row, maxN, fht, fps);
    base = row * maxN;
    for (let col=0; col<maxN; col++) {
      r = fps[base+col];
      if (r<min) {min = r;}
      if (r>max) {max = r;}
    }
  }
  if (min<1.0){
    min = 0;}
  else{
    min = Math.log(min);}
  max = Math.log(max);
  scale = (253.0/(max-min));

  for (var row=0; row<maxN; row++) {
    base = row*maxN;
    for (var col=0; col<maxN; col++) {
      r = fps[base+col];
      if (r<1) {r = 0;}
      else{r = Math.log(r);}
      ps[base+col] = (((r-min)*scale+0.5)+1);
    }
  }
  fht = ps;
}
/** Power Spectrum of one row from 2D Hartley Transform. */
function FHTps(row, maxN, fht, ps) {
  var base = row*maxN;
  for (let c=0; c<maxN; c++) {
    var l = ((maxN-row)%maxN) * maxN + (maxN-c)%maxN;
    ps[base+c] = (Math.sqrt(fht[base+c]) + Math.sqrt(fht[l] /2));
  }
  return ps;
}

 function dfht3( x, base, maxN, co, si) {
  //var Ad0; var Ad1; var Ad2; var Ad3; var Ad4; var CSAd;
  //var rt1; var rt2; var rt3; var rt4;

  // if (S==null) initializeTables(maxN);
  var Nlog2 = Math.log2(maxN);

  BitRevRArr(x, base, Nlog2, maxN);    //bitReverse the input array
  var gpSize = 2;     //first & second stages - do radix 4 butterflies once thru
  var numGps = maxN / 4;
  for (let gpNum=0; gpNum<numGps; gpNum++){
    let Ad1 = gpNum * 4;
    let Ad2 = Ad1 + 1;
    let Ad3 = Ad1 + gpSize;
    let Ad4 = Ad2 + gpSize;
    let rt1 = x[base+Ad1] + x[base+Ad2];   // a + b
    let rt2 = x[base+Ad1] - x[base+Ad2];   // a - b
    let rt3 = x[base+Ad3] + x[base+Ad4];   // c + d
    let rt4 = x[base+Ad3] - x[base+Ad4];   // c - d
    x[base+Ad1] = rt1 + rt3;      // a + b + (c + d)
    x[base+Ad2] = rt2 + rt4;      // a - b + (c - d)
    x[base+Ad3] = rt1 - rt3;      // a + b - (c + d)
    x[base+Ad4] = rt2 - rt4;      // a - b - (c - d)

   }

 // --> cette partie ne fonctionne pas !!!!
  if (Nlog2 > 2) {
     // third + stages computed here

    numBfs = 2;
    numGps = numGps / 2;
    //IJ.write("FFT: dfht3 "+Nlog2+" "+numGps+" "+numBfs);
    for (var stage=2; stage<Nlog2; stage++) {
      for (gpNum=0; gpNum<numGps; gpNum++) {
        let gpSize = 4;
        let Ad0 = gpNum * gpSize * 2;
        let Ad1 = Ad0;     // 1st butterfly is different from others - no mults needed
        let Ad2 = Ad1 + gpSize;
        let Ad3 = Ad1 + gpSize / 2;
        let Ad4 = Ad3 + gpSize;
        let rt1 = x[base+Ad1];
        x[base+Ad1] = x[base+Ad1] + x[base+Ad2];
        x[base+Ad2] = rt1 - x[base+Ad2];
        rt1 = x[base+Ad3];
        x[base+Ad3] = x[base+Ad3] + x[base+Ad4];
        x[base+Ad4] = rt1 - x[base+Ad4];

//en haut ça fait pas de NaN
        for (bfNum=1; bfNum<numBfs; bfNum++) {
        // subsequent BF's dealt with together
          let Ad1 = bfNum + Ad0;
          console.log("ad1" + Ad1);
          let Ad2 = Ad1 + gpSize;
          let Ad3 = gpSize - bfNum + Ad0;
          let Ad4 = Ad3 + gpSize;
          console.log("Ad4 =" + Ad4)

          let CSAd = bfNum * numGps;
          // console.log("CSAd: " + CSAd);
          //console.log("base : "+base); ??
          //console.log(x[base+Ad2]); -> contient des NaN à la fin
          //console.log("co : "+co[CSAd]);// -> contient des undefined
          //console.log(x[base+Ad4]); -> n'est que NaN
          //console.log(si[CSAd]); -> contient des undefined
          //console.log(base+Ad2); -> ok
          //console.log(typeof(base+ad4));
          // let rt1 = x[base+Ad2] * co[CSAd] + x[base+Ad4] * si[CSAd];
          // let rt2 = x[base+Ad4] * co[CSAd] - x[base+Ad2] * si[CSAd];
          let rt1 = x[Math.abs(base+Ad2)]  + x[Math.abs(base+Ad4)] ;
          let rt2 = x[Math.abs(base+Ad4)]  - x[Math.abs(base+Ad2)] ;

           console.log("RT1= " + rt1);
           console.log("RT2= " + rt2);

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
 //---> jusque là !!!!
   for (let i=0; i<maxN; i++){
     x[base+i] = x[base+i] / maxN;
 }//--> mais le for il fait un truc bizard aussi
}
function transposeR ( x, maxN) {
  var r, c;
  var rTemp;

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

// void makeBitReverseTable(var maxN) {
//   bitrev = new var[maxN];
//   var nLog2 = log2(maxN);
//   for (var i=0; i<maxN; i++)
//     bitrev[i] = bitRevi, nLog2);

 function BitRevRArr (x, base, bitlen, maxN) {
   //make bit reverse table
   var nLog2 = Math.log2(maxN);
   var bitrev= new Array();
   var tempArr= new Array();
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

/**
 * Display uint8 images
 */
let img0 = new T.Image('uint8',360,288);
img0.setPixels(boats_pixels);
dfht(img0.raster.pixelData);


let win0 = new T.Window('Boats');
//dfht(img0);
// img0.setPixels(dfht(img0));
//
let view0 = T.view(img0.getRaster());

// Create the window content from the view
win0.addView(view0);
// Add the window to the DOM and display it
win0.addToDOM('workspace');


/**
 * Display uint16 images
 */
let img01 = new T.Image('uint16',256,254);
let uint16_blobs = blobs_pixels.map ( (px) => px * 256);
img01.setPixels(uint16_blobs);
let win01 = new T.Window('Blobs uint16');
let view01 = T.view(img01.getRaster());
// Create the window content from the view
win01.addView(view01);
// Add the window to the DOM and display it
win01.addToDOM('workspace');


/**
 * Display float32 images
 */
let img02 = new T.Image('float32',256,254);
let float_blobs = blobs_pixels.map( (px) => px/128 - 1.0);
img02.setPixels(float_blobs);
let win02 = new T.Window('Blobs float32');
let view02 = T.view(img02.getRaster());
// Create the window content from the view
win02.addView(view02);
// Add the window to the DOM and display it
win02.addToDOM('workspace');

// /**
//  * Display float32 images
//  */
// let img1 = new T.Image('uvar8',256,254);
// img1.setPixels(blobs_pixels);
// let win1 = new T.Window('Blobs Salt&Pepper');
// let workflow1 = T.pipe(T.saltAndPepper(0.1), T.view);
// let view1 = workflow1(img1.getRaster());
// // Create the window content from the view
// win1.addView(view1);
// // Add the window to the DOM and display it
// win1.addToDOM('workspace');
//
// /**
//  * Display rgba images
//  */
// let img2 = new T.Image('rgba',320,200);
// img2.setPixels(clown_pixels);
// let win2 = new T.Window('Clown');
// let view2 = T.view(img2.getRaster());
// // Create the window content from the view
// win2.addView(view2);
// // Add the window to the DOM and display it
// win2.addToDOM('workspace');
//
// let img21 = new T.Image('rgba',320,200);
// img21.setPixels(clown_pixels);
// let process = T.pipe(T.crop(140,23,112,103),T.view);
// let view21 = process(img21.getRaster());
// console.log(`${view21.width} x ${view21.height} `);
// let win21 = new T.Window('Clown crop');
// // Create the window content from the view
// win21.addView(view21);
// // Add the window to the DOM and display it
// win21.addToDOM('workspace');
//
// /**
//  * Raster Fill
//  */
// const DEG = Math.PI/180.0;
// const spiral = (pix,i,x,y,z,w,h,a,d) => 128 * (Math.sin(d / 10+ a * DEG)+1);
// const sine = (pix,i,x,y) => Math.sin((x + 2*y) * 5 * DEG) * 100 + 127;
// const halves = (pix,i,x,y,z,w,h) => (x > w/2) ? pix & 0xffffff | 0x80000000 : pix;
//
// // Spiral
// let img3 = new T.Image('uvar8',300,300);
// let workflow3 = T.pipe(T.fill(spiral),T.view);
// let view3 = workflow3(img3.getRaster());
// let win3 = new T.Window('Spiral');
// win3.addView(view3);
// // Add the window to the DOM and display it
// win3.addToDOM('workspace');
//
// //Ramp
// let img4 = new T.Image('uvar8',350,50);
// let workflow4 = T.pipe(T.fill(T.ramp),T.view);
// let view4 = workflow4(img4.getRaster());
// let win4 = new T.Window('Ramp');
// win4.addView(view4);
// // Add the window to the DOM and display it
// win4.addToDOM('workspace');
//
// // Transparency
// let img5 = new T.Image('rgba',320,200);
// img5.setPixels(clown_pixels);
// let workflow5 = T.pipe(T.math(halves),T.view);
// let view5 = workflow5(img5.getRaster());
// let win5 = new T.Window('Clown and Transparency');
// win5.addView(view5);
// // Add the window to the DOM and display it
// win5.addToDOM('workspace');
//
// /**
//  * Raster Calc
//  */
// const divideBy = (k) => (px) => px / k;
// const multiplyBy = (k) => (px) => px * k;
// let img61 = new T.Image('uvar8',200,200);
// let raster61 = T.pipe(T.fill(T.chessboard),T.math(divideBy(2.0)))(img61.getRaster());
// let img62 = new T.Image('uvar8',200,200);
// let raster62 = T.pipe(T.fill(T.spiral),T.math(multiplyBy(0.5)))(img62.getRaster());
// let rasterAdd = T.calc(raster61, (px1,px2)=> T.clampUvar8(px1 + px2) )(raster62);
// let win6 = new T.Window('Chessboard plus Spiral');
// win6.addView(T.view(rasterAdd));
// // Add the window to the DOM and display it
// win6.addToDOM('workspace');