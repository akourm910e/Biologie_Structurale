# Implementation of Fast Fourier Transform
Ninon De Mecquenem*, Antoine Kourmanalieva and Leo Grosjean. 

## Introduction 

Jean Baptiste Joseph Fourier is a XIXth century mathematician known for his work about warm propagation. His study leads him to transform any function of a variable in a series of periodic functions (Fourier series).[^FOU1822] Even if his work is uncomplete, this has been a breakthrough and it is just later, thanks to Joseph Louis Lagrange and Peter Gustav Lejeune Dirichlet, that the Fourier Transform became what we currently know. The Fourier Transform is now a powerfull tool in image processing. It converts images from their spacial domain to the frequential domain without loss of information. The Fast Fourier Transform (FFT) algorithm computes the Discrete Fourier Transform (DFT) which is a mathematical tool revealing periodicity in data. The DFT is used in many domains and is quite slow to compute. The improvement of the FFT is to compute it more efficiently : N^2 operations in DFT and nlogn operations for FFT.


## 1. Materiel and methods

### 1.1 FFT - Cooley-Tukey algorithm (1805/Gauss, Widespread 1965/Cooley&Tukey).  

The Cooley-Tukey algorithm is the most common Fast Fourier Transform (FFT) algorithm. It uses general technique of divide and conquer algorithms. 
The algorithm breaks the Discrete Fourier Transform(DFT) into smaller DFTs, to perform recursively the FFT to reduce the computation time to O(N log N) for highly composite N. 

Formula of DFT : 

![formula](https://github.com/akourm910e/Biologie_Structurale/blob/master/fDFT.png)

Cooley-Tukey algorithm pseudocode: 
```
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
```   

The simple form of the algorithm uses a radix-2 decimation-in-time (DIT) FFT.
Radix-2 DIT first computes the DFTs of the even-indexed array of pixel values array , and of the odd-indexed of pixel values array and then combines those two results to produce the DFT of the whole sequence. This idea can then be performed recursively to reduce the overall runtime to O(N log N). This simplified form assumes that N is a power of two.
The algorithm gains its speed by re-using the results of intermediate computations to compute multiple DFT outputs.

Workflow:

1. get pixel values.
2. separe even-indexed and odd-indexed pixel values of array.
3. Perform the radix2 DIT.
4. return pixel values.

### 1.2 Fast Hartley Transform
### 1.3 Fast Fourier Transform (Numerical recipe)


## 2.Results
 
 ### Benchmark
 ### 2.1 Fast Fourier Transform (Cooley and Tukey)
 ### 2.2 Fast Hartley Transform
 ### 2.3 Fast Fourier Transform (Numerical recipe)




## References
