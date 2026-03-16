a<- c(1,2,3,4, TRUE,FALSE,"Anjali")
a
v1<-1:50
v1

seq(7,70,7)
seq(from=9,to=90,by=9)

rep(x=9,times=10)
rep(x=c(5,10,15),times=4)
rep(x=c(5,10,15),each=4,times=5)

sort(x=c(2,7,6789,9,5,1),decreasing = TRUE)
sort(x=c(2,7,6,9,5,1),decreasing = FALSE)

length(x=c(4,7,8,6))

#indexing and accessing element in r
a<-c(10,20,30,40,50,60,70,80,90)
a[5]
a[3:5]
a[c(2,7)]
a[-1]
a[-3:-5]
a[c(-1,-9)]

#replacing element in vector
vec<-c(10,20,30,40)
vec[4]<-35


#operating in vector
vec<-c(10,20,30,40,50)
vec1<-c(2,3,4,5)
vec2<-vec+vec1

#MATRIX
m<-matrix(1:60,nrow = 8,ncol = 8,byrow = TRUE)
m
m[5,4]
m[6,]
m[ ,8]
m[5,4:6]
m[3:6,3]
m[3:5,3:6]
m[c(2,5,7),c(2,5,7)]
diag(m)
t(m)#transpoge row ra colum lai change garxa





