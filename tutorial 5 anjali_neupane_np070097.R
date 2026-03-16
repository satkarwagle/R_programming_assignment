x <- c(40:100)
class(x) #checking the class

#if not, convert to integer.
is.integer(x)
as.integer(x)#convert

#find mean row and column
x <- matrix(x,8)
rowMeans(x)
colMeans(x)

#split the string
substring("hello world", c(1, 7, 9), c(4, 7, 11))
#count the num
nchar("hello")
#extract the word
substring("Today is a good day", 12, 15)
#cube root
7^(1/3)
#Create a 9×9 matrix by row and find elements greater than 2 from the matrix.
m <- matrix(1:81, nrow = 9, byrow = TRUE)
m[m > 2]
#count the num of element greater then 5
length(m[m > 5])
#print odd even
m[m %% 2 != 0]
#create the vector
v <- c(2, 5, 7, 9, 12)
#extract first 3 element
v[1:3]
#1Extract all except the 2nd element.
v[-2]

#Enter any 7 marks between 50 to 100 as marks and give a name to each
element in the marks.
marks <- c(78, 85, 90, 67, 88, 72, 95)
names(marks) <- c("A", "B", "C", "D", "E", "F", "G")
marks
#Create a list that contains a numeric vector, a character vector, and a logical
#value.
mylist <- list(
  numbers = c(1, 2, 3),
  letters = c("a", "b", "c"),
  status = TRUE
)
#Given x <- c(3, 5, 7, 9) and y <- c(2, 4, 6, 8), compute x + y, x * y, and the mean
#of x.

x <- c(3, 5, 7, 9)
y <- c(2, 4, 6, 8)

x + y
x * y
mean(x)

#Find the matrix multiplication of any two 4×4 matrices.
A <- matrix(1:16, nrow = 4)
B <- matrix(17:32, nrow = 4)

A %*% B















