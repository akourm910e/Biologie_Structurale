# The Fast Fourier Transform

Authors : * De Mecquenem Ninon, Grosjean Léo, Kourmanalieva Antoine

Here you can find the link to our Github containing further information : https://github.com/Nine-s/Biologie_Structurale

## Introduction

Jean Baptiste Joseph Fourier is a XIXth century mathematician known for his work about warm propagation. His study leads him to transform any function of a variable in a series of periodic functions (Fourier series).[^FOU1822] Even if his work is uncomplete, this has been a breakthrough and it is just later, thanks to Joseph Louis Lagrange and Peter Gustav Lejeune Dirichlet, that the Fourier Transform became what we currently know. The Fourier Transform is now a powerfull tool in image processing. It converts images from their spacial domain to the frequential domain without loss of information. The Fast Fourier Transform (FFT) algorithm computes the Discrete Fourier Transform (DFT) which is a mathematical tool revealing periodicity in data. The DFT is used in many domains and is quite slow to compute. The improvement of the FFT is to compute it more efficiently : *N^2* operations in DFT and *nlogn* operations for FFT.

The first algorithm of DFT was written by Gauss who worked on asteroid's orbits. It was then published by James William Cooley and John Tukey, and their algorithm is still the most comonly used and called the Cooley Tukey FFT algorithm. In the image processing domain, the FFT can be used to remove unwanted elements or to improve the visualisation for posterior treatments. As it works with periodic signals, it is also used in sound treatment for instance.[^HEI1984]

How the FFT algorithms work and what algorithm is the most efficient are the questions this study is based on. To answer it, we will use ImageJ as a reference. ImageJ is an image processing program developed with Java language by the National Institutes of Health. It's an open architecture, and provides extensibility. Java plugins and recordable macros can be created to custom analysis and processing. This allows a great freedom of adaptation to resolve many problems. ImageJ is mainly used by scientists, including biologists.[^SCH2012] The basic implemented function is not a Direct Fourier Transform but an Harley transform. It does similar operations but without using complex numbers so it is more efficient. As it is not a Fourier Transform, it will not be evocated later. However there are ImageJ FFT plugins that we can compare. The comparison will be done using Micro Benchmarking.[^PIC1988]

## Material and Methods

The main principle of FFT is to apply several small Discrete Fourier Transforms (DFT). A DFT converts a finite sequence of N equally-spaced samples. In image processing, pixels value along a row or column are generally used. This sequence is then computed into a same length sequence of a complex-valued samples which are function of frequency. The DFT is therefore said to be a frequency domain representation of the original input. From a theoretical point of view, the complexity issue of the discrete Fourier transform has reached a certain maturity. Some work on length-2 DFTs showed the linear multiplicative complexity of DFT. Appart from that, as it deals with a finite amount of data, it is nowadays efficiently implemented in computers numerical FFT algorithms.[^DUH1999]

### Cooley & Tukey FFT Algorithm (1805/Gauss, Widespread 1965/Cooley&Tukey)

As the Fourier Transform is widely used, a lot of algorithms have been made to compute it. The most common algorithm is called the Cooley&Tukey FFT Algorithm. It was first defined by Gauss, but Cooley and Tukey widespread it in 1965, putting it as a strong reference since then. This algorithm consists in a break of the DFT into smaller DFTs, triggering a N1 smaller DFTs of sizes N2 (N=N1N2). Either N1 and N2 can possibly become a small factor called radix. If N1 is the radix, the variant computed technique will be called Decimation in Time (DIT). In an other hand, if N2 become the radix, the technique would be a Decimation in Frequency (DIF). We can also differenciate two computational differences depending on the N samples. If N is a power of two, The Cooley variant algorithm will be a Radix-2, which is mathematically considered as the simplest and highly optimized algorithm. The algorithm in this case first segregate the input into two indexes for odd and even numbers. Then it recursively combines the two resulted DFTs parts to produce the DFT in one whole sequence. A similar process is done when N is not a power of two, with a technique called Mixed Radix : The N DFT is computable using two N/2 DFTs, and can have a recursive application using a twiddle factor. A Twiddle Factor is any of the trigonometric constant coefficient multiplied by the input data during the algorithm. They are used to recursively combine smaller DFT.[^DUH1999]

### Prime Factor Algorithm (PFA)

The PFA is also called Good-Thomas Algorithm. This algorithm is derived from the ancient chinese Remainder theorem. It is only efficient when factors of N are mutually prime, and is ideally combined with a mixed radix algorithm, sometimes with a convolution. Actually, the PFA can be confused with the radix Cooley&Tukey algorithm. But PFA can only work with relatively prime factors and requires a more complex re-indexing of the input, making it less used. However PFA doesn't need any twiddle factor during the computation process. Furthermore, some studies showed interesting modular algorithms, using Fortran, which had improved computational efficiency of DFT.[^KOL1977][^BUR1981]

### Cyclic Convolutionnal Algorithms

Determined in late XXth century, They're also based on Cooley&Tukey Algorithm. We can distinguish 2 main algorithm. First Rader's algorithm (1968/Charles M. Rader), which is based on prime sized DFTs as a cyclic convolution. It only depends upon the periodicity of DFT Kernel. But a factor of two can be applied, saving the real data.[^GOL1969] One other is Bluestein's Algorithm, or Chirp-z Transform, wich,as Rader's FFT, computes a cyclic convolution for prime sized DFTs. A significant difference is that Bluestein's Algorithm can also work when the length is not prime, which make it very usefull. The specialty of this algorithm is that it could compute the DFT, real DFT and zoom DFT. *Bluestein's FFT algorithm* can be used to compute a contiguous subset of DFT frequency samples, and research is still made to improve is efficiency.[^AMA2015]


### Bruun's Algorithm (1978)

It is based on a recursive polynomial factorization. It involves only a real coefficient until last computational stage. Furthermore, it may intrisically be less accurate than Cooley&Tukey. It is a good FFT based approach on real data though.


### Hexagonal FFT

Hexagonal FFT (HFFT) has first been developed to use the advantages of hexagonal sampling wich provides good digital methods to process signals. It computes a FFT with a separable Fourier kernel using Array Set Addressing (ASA) scheme and an Hexagonal Fast Fourier Transform (HDFT). An hexagonal grid improves the efficiency because of its higher symmetry and consistent connectivity. Despite that, its application is limited because of its inability to compute orthogonal rows and columns, as a Cooley&Tukey algorithm.

All of those methods are available to compute FFT. The question now is to know which algorithm is the more efficient. To answer it, we will use Benchmarking, more precisely Micro-Benchmarking. The Benchmark consists in knowing the relative performance of a program while running it. Factors such as the used resources like the memory and CPU will be mesured. The values obtained are then compared to other programs with the same purpose. It allows the developper to see if his algorithm and implementation are an improvement compared to the references. Micro Benchmarking is a specific Benchmark. The difference is that Micro Benchmark just mesure the performances of a little piece of code, here we compare plugins and not softwares for instance.[^WEE1984]

In this study, running time and used memory will be mesured and will allow us to compare plugins using different algorithms. The processor use is compare through the time of execution.

## Results

The family of algorithm described in previous section will not be represented here. Indeed, as the Cooley Tukey FFT algorithm is mainly used, there is not a plugin for each of the other algorithms.
Here will be compared two FFT plugins : one using the *Cooley Tukey FFT algorithm* and one using *Bluestein FFT algorithm*.
The first one is from the website of *Preibisch* Laboratory, the Berlin Institute of Medical Systems Biology (BIMSB). This website contains the FFT Transform Plugin (2D/3D). The second one is from the **Xlib** plugins and can process FFT 2D and 3D images of arbitrary size. These plugins also do the inverse FFT. This operation consists in using the FFT spectrum to get back the original image. Thanks to this option, it is possible to do modification on the spectrum to modify caracteristics on the initial image.

The Benchmark used bellow is a JavaScript program we have written. It takes different mesures : the time of execution and the memory used. We have run it in the same conditions and on the same image.
We have run this test 10 000 times for each plugin to have enough data. Furthermore, there is a warm-up phase of 100 iteration. We would have prefered to compare the algorithms without the whole plugin. Unfortunately, we don't have access to the source code of the *Preibisch* plugin. Therefore, it is not possible to implement Benchmark directly in the plugins. However, as the Benchmark is a relative study, if we run it in a comparable way for both plugins, it is still informative.

To run our Benchmark, we have chosen an image in the image samples of ImageJ : *embryos.jpg*. We have chosen it because it is available to every ImageJ user and make those tests reproductible.

![Alt text](https://github.com/Nine-s/Biologie_Structurale/blob/master/Images/embryos.jpg "Reference Image")
*Figure 1: Image from samples of ImageJ, used as a reference image to run the FFT plugins*


To compare the two plugins, it is interesting to study the outputs of the *FFT* done on the embryos image. So the output images have been saved and showed here.


![Alt text](https://github.com/Nine-s/Biologie_Structurale/blob/master/Images/beat_FFT%202D_imag_no%20scal.jpg "Output 1 of *Xlib* plugin")
*Figure 2: Output of *Xlib* plugin showing the imaginary part of the image*


![Alt text](https://github.com/Nine-s/Biologie_Structurale/blob/master/Images/beat_FFT2D_real_no%20scal.jpg "Output 2 of *Xlib* plugin")
*Figure 3: Output of *Xlib* plugin showing the real part of the image*


![Alt text](https://github.com/Nine-s/Biologie_Structurale/blob/master/Images/fft_Phase_of_img.jpg "Output 1 of *Preibisch* plugin")
*Figure 4: Output of *Preibisch* plugin showing the phase spectrum of the image*

![Alt text](https://github.com/Nine-s/Biologie_Structurale/blob/master/Images/fft_Power_of_img_embryos.jpg "Output 2 of *Preibisch* plugin")
*Figure 5: Output of *Preibisch* plugin showing the power spectrum of the image*

Compare the FFT plugins can be done thanks to a quantitative approach using Benchmark, but it is hard to compare it qualitatively. Indeed, it is difficult to know what the FFT of an image should look like. But we can see that the two plugins do not display the same windows, and it is a thing we can compare. We can see that each plugin display two images. The *Xlib* plugin displays the image of the real part of the embryos and also it's imaginary part. The real part represent the magnitude multiplied by cosinus phase and the imaginary part the magnitude multiplied by sinus phase. Magnitude is the absolute values of the image frequences, it is obtained when complex numbers are transformed into a polar representation (magnitude, phase). The phase component of the polar representation varies from *pi* to *-pi*. The *Preibisch* plugin displays the power and the phase spectra. The power is the square of magnitude of FFT and gives us a similar pattern that the real part of the *Xlib* plugin and the basis ImageJ FFT. Real/imaginary and power/phase are two different ways to represent FFT spectrum. One way is not better than another, but in both cases, the outputs are complementary and necessary to get back on the image with the inverse FFT.
It is interesting to notice that the *Preibisch* plugin just displays half of the FFT show by *Xlib* plugin. It is not a problem because half is enough because the FFT is similar about the origin: first quadrant is similar to the third and the second to the fourth.

![Alt text](https://github.com/Nine-s/Biologie_Structurale/blob/master/Images/logTime.png "Time Benchmark result")
*Figure 6: Box plot comparing the running time of the two plugins. Here, the "Function1" is *Xlib* plugin and the second one is the Bluestein's plugin*

![Alt text](https://github.com/Nine-s/Biologie_Structurale/blob/master/Images/Plotmemory.png "Memory Benchmark result")
*Figure 7: Box plot comparing the memory usage of the two plugins. Here, the "Function1" is *Xlib* plugin and the second one is the Bluestein's plugin*

Those comparisons have been done on a computer with a those caracteristics :
* Processor : Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz
* RAM : 8Go
* HD : 256Go SSD
* OS : Xubuntu 17.04
* Allocated memory for ImageJ : 4815MB
* Threads used in parallel by imageJ : 4

Here the *Function1* is the **Xlib** plugin using Bluestein's algorithm and the *Function2* is the *Preibisch* plugin using *Cooley and Tukey algorithm*.
We have chosen to represent the Benchmark result with Boxplot we have obtained using the software *R*. Indeed, we thought that the average of the results can be informative, but just the average did not seem enough to represent an analysis.
As the run time of the plugins is displayed in milliseconds, the boxplot were not clear. For a better clarity, we have chosen to represent it with the logarithm of the time.
We can see that the *Preibisch* plugin is faster and uses less memory than the *Xlib* plugin.

## Discussion

Between the two plugins tested, Micro-Benchmarking showed that the one developed by *Preibisch* is more efficient than the *Xlib* plugin which was released more than seven years after (*Preibisch* released on 2008, 2015 for *Xlib*). It seems that the *Cooley and Tukey algorithm* is then more efficient than Bluestein's algorithm. We decided not to run benchmark with reverse FFT, considering that it would give the similar results, as it uses similar functions than the forward FFT, making no significant differences. However, we only benchmarked the two programs on one single RGB image. This study could then have been completed by testing further different conditions, using 8-bits, 16-bits, 32-bits images. The results are then reliable on RGB images, but could have been completed though. Furthermore, the two plugins have a tridimensional FFT option, that could have been interesting to test too.

Another point is that we searched for plugins running only on ImageJ software, reducing the amount of avalaible programs. It would be interesting to look on FFT plugins included in other image processing softwares, such as cell-profiler (Biology, Microscopy), FTL-SE (Crystallography) or MatLab(Numerical Computing).

## Conclusion
It has been shown here that there are many FFT algorithms existing, all treating different cases, and are usefull in different domains.This is not surprising, as the FFT is an important mathematical breakthrough, and is probably one the most widespreaded tool in image processing.
From this study, it appears that the *Cooley and Tukey algorithm* is more efficient than Bluestein's algorithm to process a FFT. As our benchmark focuses on running speed and memory used, it doesn't deny the fact that Bluestein's algorithm can be usefull in some specific process. The lack of existing plugins running on ImageJ triggered the impossibility to test the efficiency of all the described algorithms.
Now that we know which algorithm is apparently the most efficient, the next steps will be to develop it with functional programing thanks to Vanilla JavaScript. Finally, we will implement it using a WebGL library and test it on a web browser.

## References

[^FOU1822]: Fourier JBJ. Théorie analytique de la chaleur. Paris F Didot. 1822

[^HEI1984]: Heideman MT, Johnson DC, Sidney Burrus C. Gauss and the History of the Fast Fourier Transform. IEEE ASSP Magazine. 1984 Oct; 1(4):14-21

[^SCH2012]: Schneider CA, Rasband WS, Eliceiri KW. NIH Image to ImageJ: 25 years of Image Analysis. Nat Methods. 2012 Jul;9(7):671-675

[^PIC1988]: Piccini F. Technical Memorandum: The Fast Hartley Transform as an alternative to the Fast Fourier Transform. Surveillance Research Laboratory.1988 Feb

[^DUH1999]: Duhamel P, Vetterli M. Fast Fourier Transform: A Tutorial Review and a State of the Art. Signal Processing. 1999;19:259-299

[^KOL1977]: Kolab DP, Parks TW. A Prime Factor FFT Algorithm Using High Speed Convolution. IEEE Transactions of Acoustics, Speech. 1977 Aug;25(4)

[^BUR1981]: Burrus CS, Eschenbacher PW. An In-Place, In-Order Prime Factor FFT Algorithm. IEEE Transactions on Acoustics, Speech, and Signal Processing. 1981 Aug;29(4)

[^GOL1969]: Gold B, Rader CM. Digital Processing of Signals. New York McGraw-Hill. 1969

[^AMA2015]: Amannah CI, Bakpo FS. Simplified Bluestein numerical Fast Fourier Transforms Algorithm for DSP and ASP. International Journal of Research Granthaalayah. 2015 Nov

[^WEE1984]: Weed JC, Polge RJ. An efficient implementation of a Hexagonal FFT. Acoustics, Speech and Signal Processing IEEE Conference. 1984 Material
