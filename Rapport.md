# Implementation of Fast Fourier Transform
Antoine Kourmanalieva, Ninon De Mecquenem and Leo Grosjean. 

## Introduction 

Jean Baptiste Joseph Fourier is a XIXth century mathematician known for his work about warm propagation. His study leads him to transform any function of a variable in a series of periodic functions (Fourier series).[^FOU1822] Even if his work is uncomplete, this has been a breakthrough and it is just later, thanks to Joseph Louis Lagrange and Peter Gustav Lejeune Dirichlet, that the Fourier Transform became what we currently know. The Fourier Transform is now a powerfull tool in image processing. It converts images from their spacial domain to the frequential domain without loss of information. The Fast Fourier Transform (FFT) algorithm computes the Discrete Fourier Transform (DFT) which is a mathematical tool revealing periodicity in data. The DFT is used in many domains and is quite slow to compute. The improvement of the FFT is to compute it more efficiently : N^2 operations in DFT and nlogn operations for FFT.


## 1. Materiel and methods

### 1.1 FFT - Cooley-Tukey algorithm (1805/Gauss, Widespread 1965/Cooley&Tukey).  

The Cooley-Tukey algorithm is the most common Fast Fourier Transform (FFT) algorithm. It uses general technique of divide and conquer algorithms. 
The algorithm breaks the Discrete Fourier Transform(DFT) into smaller DFTs, to perform recursively the FFT to reduce the computation time to O(N log N) for highly composite N. 

Formula of DFT : 

![Alt text](fDFT.png "Cooley-Tukey algorithm pseudocode")

Cooley-Tukey algorithm pseudocode: 
'''
DFT of (x0, xs, x2s, ..., x(N-1)s):
    trivial size-1 DFT base case
    DFT of (x0, x2s, x4s, ...)
    DFT of (xs, xs+2s, xs+4s, ...)
    combine DFTs of two halves into full DFT:

X0,...,N−1 ← ditfft2(x, N, s):             
    if N = 1 then
        X0 ← x0                                      
    else
        X0,...,N/2−1 ← ditfft2(x, N/2, 2s)             
        XN/2,...,N−1 ← ditfft2(x+s, N/2, 2s)           
        for k = 0 to N/2−1                           
            t ← Xk
            Xk ← t + exp(−2πi k/N) Xk+N/2
            Xk+N/2 ← t − exp(−2πi k/N) Xk+N/2
        endfor
    endif
    

'''
The simple form of the algorithm uses a radix-2 decimation-in-time (DIT) FFT.
Radix-2 DIT first computes the DFTs of the even-indexed array of pixel values array , and of the odd-indexed of pixel values array and then combines those two results to produce the DFT of the whole sequence. This idea can then be performed recursively to reduce the overall runtime to O(N log N). This simplified form assumes that N is a power of two.
The algorithm gains its speed by re-using the results of intermediate computations to compute multiple DFT outputs.

Programm summary:

1. get pixel values.
2. separe even-indexed and odd-indexed pixel values of array.
3. Perform the radix2 DIT.


### 1.2 Fast Hartley Transform 


1. Computation of the integral image.

To compute the integral image, the sum of all f(x,y) terms to the left and above the pixels(x,y) is store at each location ,I(x,y) using the following equation 1 : 

 <img style="align:center" src="https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/Equation%201.png" alt="Equation of integral image.">
    <em>Equation of integral image.</em>
    
![Equation of integral image.](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/Equation%201.png)


 In practice, a pixel of the integral image I(x,y) is calculated from the sum of the pixels of the image above f(x, yi) added to the left pixel of the previously calculated integral image such that I (x-1,y). 
At the same time the thresholding step at pixel is compute.

2. Computation kernel coordinates.
3. Computation the area of kernel.
4. Computation the sum of the pixels visited by the kernel.

the sum of the the pixel visited by the kernel is compute using the following equation :


https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/Equationsum.png)

5. Determination the pixel value.</li>


 To determine the pixel value of the binary image, the product of the pixel value of the input image and the area of kernel is compared to the product of the sum of the pixels of the kernel with value given by the user to modulate this sum value. If the first product is lower than the second or equal the value of the pixel will be 0 and vice versa of 255.
 
 ### Max-entropy
 
 The entropy of grayscale image is statistical measure of randomness that can be used to characterize the texture of the input image. It is used to describe the business of an image, i.e. the amount of information which must be coded for by a compression algorithm. This method use the derivation of the probability distribution of gray-levels to define the entropies and then find the maximum information between the object and the background - the entropy maximum, the threshold value.
 
Programm summary:
 
1. Determine the normalized histogram, and then calculate the cumulative normalized histogram.
2. Determine the first and the last non-zero bin.
3. Calculate the entropy of the background pixels and the entropy of object pixels.
4. Add these two entropy to get the total entropy for each gray-level and find the threshold that maximizes it.

 
 ### Otsu
 
 Otsu method is a non-parametric and unsupervised method of automatic threshold selection for picture segmentation. The algorithm assumes that the image contains two classes of pixels following bimodal histogram (foreground pixels and background pixels),and search for the threshold that minimizes the intra-class variance (weighted sum of variances of the two classes). The aim is to find the threshold value where the sum of foreground and background spreads is at its minimum.
 
Programm summary:
 

1. Compute histogram and probabilities of each intensity level.
2. Set up initial class probability and initial class means.
3. Step through all possible thresholds maximum intensity.
4. Compute between class variance.
5. Desired threshold corresponds to the maximum value of between class variance.
 
 ## Results
 
 A benchmarking has been used to compare the methods. It uses the performance.now() method returning a DOMHighResTimeStamp, measured in milliseconds, accurate to five thousandths of a millisecond (5 microseconds). 
The results are in millisecond and represent the mean of 100 iterations of the method after 100 iteration to warming it up. It compares the method according to the size of an image (1 "lena" to 10 "lenas") and to two web browsers : Firefox (Quantum 57.0.2 64bits) and Chrome (63.0.3239.84 64bits).

### k-means

![Benchmark with Firefox and Chrome(F = Firefox, C = Chrome).](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/KmeansImage1.png) 

  The two implemented methods are faster on Firefox than on Chrome. The result are also less fluctuating on Firefox. 

![Comparison between two implementation with and without histogram.](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/KmeansImage2.png) 

The second method implemented is faster than the first (10 times faster on a 512*512 pixels image to 50 times faster on a image with 10x more pixels). 


![Benchmark to compare the two K values K=2 and K=3 using Firefox.](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/KmeansImage3.png)  

The number of loop turn is only correlated to the k-number and not to the image size. 


![Ratio of time between the execution of algorithm and the creation od raster using Firefox.](https://github.com/rmy17/bioinf-struct/blob/master/projectThreshold/images/KmeansImage4.png)  

The loading of the Raster in the method takes around 75% of the time of the method.



## References

[^BRA2007]: Bradley D, Roth G. Adaptive thresholding using integral image. Journal of Graphics Tools. Volume 12, Issue 2.  pp. 13-21. 2007. NRC 48816.
