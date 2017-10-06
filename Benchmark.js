//BenchmarkTime Function -> return time
function TimeBenchmark(imp, nb_iter, myFunction){
var MyStartTimeLoop = System.currentTimeMillis();
for (i=0; i<nb_iter; i++){
	var MyStartTime = System.currentTimeMillis();
	if (myFunction==1){
		MyFunction1(imp);
	}
	if (myFunction==2){
		MyFunction2(imp);
	}
	var MyEndTime = System.currentTimeMillis();
	var MyRunTime = MyEndTime - MyStartTime;
	print (MyRunTime);
	}
var MyEndTimeLoop = System.currentTimeMillis();
var MyRunTimeLoop = MyEndTimeLoop - MyStartTimeLoop;
print ("Time for a loop of "+ nb_iter +" iteration : "+ MyRunTimeLoop);

}

//BenchmarkMemoryFunction -> return memory used
function MemoryBenchmark(imp, nb_iteri, myFunction){
var MyStartMemory = IJ.currentMemory();
print ("start memory: " + MyStartMemory);
for (i=0; i<nb_iter; i++){
	if (myFunction==1){
		MyFunction1(imp);
	}
	if (myFunction==2){
		MyFunction2(imp);
	}
	var MyUsedMemory = IJ.currentMemory();
	print (MyUsedMemory);
	}
var MyEndUsedMemory = IJ.currentMemory();
var MyFinalUsedMemory = MyEndUsedMemory - MyStartMemory;
print ("memory used by the loop of "+ nb_iter+" : " + MyFinalUsedMemory);
}


function MyFunction1(imp){
// plugin -> beat -> FFT 2D-3D
IJ.run(imp, "FFT 2D 3D", "real=[0 embryos.jpg] imaginary=[] scaling=none");
IJ.selectWindow("FFT 2D, real, no scal");
IJ.run("Close");
IJ.selectWindow("FFT 2D, imag, no scal");
IJ.run("Close");


}

function MyFunction2(imp){
// plugin -> fft -> fft
IJ.run(imp, "Fast FourierTransform", "use_channel=[Red, Green and Blue] direction_of_fft_transform=Forward use_multi-threaded windowing type_of_logarithm_for_power_spectrum=[Generalized Logarithm (gLog, c = 2)]");
IJ.selectWindow("Phase of img[embryos.jpg (1600x1200x1x1x1)]"); 
IJ.run("Close");
IJ.selectWindow("Power of img[embryos.jpg (1600x1200x1x1x1)]");
IJ.run("Close");

}



//main -> BenchmarkTime & BenchmarkMemoryFunction
imp = IJ.openImage("http://wsr.imagej.net/images/embryos.jpg");
imp.show();


var nb_iter = 10000;
var nb_warmup = 100;
//warmup 1
for (i=0; i<nb_warmup; i++){
	MyFunction1(imp);
 }
 print('My Memory Benchmark');
 MemoryBenchmark(imp, nb_iter, 1);
 print('______________');
 print('My Time Benchmark');
 TimeBenchmark(imp, nb_iter, 1);
 print('______________');

//warmup 2
for (i=0; i<nb_warmup; i++){
	MyFunction1(imp);
}
 print('My Memory Benchmark');
 MemoryBenchmark(imp, nb_iter, 2);
 print('______________');
 print('My Time Benchmark');
TimeBenchmark(imp, nb_iter, 2);
print('______________');

