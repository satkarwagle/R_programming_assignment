install.packages("rlang")
library(rlang)
install.packages("ggplot2")
library(ggplot2)

data("economics",package = "ggplot2")
economics

#line chart
ggplot( economics, ases(x=date, y=pop))+ geom_line(color="Blue")+labs(title="total populatio",x="population",y="date")

#1b
install.packages("dplyr")
library(dplyr)

economics_filtered<-filter(economics,data >as.Date("2005-01-01"))
economics_filtered
ggplot(economics_filtered,aes(x=date,y=pop))+geom_line(color="Blue")
#2
install.packages("nycflights13")
library(nycflights13)
data(flights,package = "nycflight13")
flights

#2a
ggplot(flights,aes(x=carrier))+geom_bar(color="black",fill="green")+labs(title="bar plot of different carrier")
#b
#using histogram
ggplot(flight,aes(x=dep_delay))+geom_histrogram(color="red",fill="yellow")
ggplot(flight,aes(x=dep_delay))+geom_freqpoly(color="red")
ggplot(flight,aes(y=dep_delay))+geom_boxplot(color="red",outlier.color="yellow")
#c
ggplot(flight,aes(x=arr_delay))+geom_freqpoly(color="red")
ggplot(flight,aes(y=arr_delay))+geom_boxplot(color="red",outlier.color="yellow")

#d

flights_flitered<-filter(flights,!is.na(dep_delay),!is.na(arr_delay))
flights_sample<-slice_sample(flights_flitered,n=1000)
ggplot(flights_sample,aes(x=dep_delay,y=arr_delay))+geom_point(alpha=0.8, color="red")
##e
ggplot(flights, aes(x=origin,y=dest))+geom_count(color="green")+
  labs(title = "covariation between origin and destination",x="origin",y="destination")
##f
ggplot(flights_flitered, aes(x = origin, y = dep_delay)) +
  geom_boxplot(color="red",fill="yellow") +
  labs(title = "Departure Delays by Origin",
       x = "Origin", y = "Departure Delay (minutes)")

##g

ggplot(flights,aes(x=dep_delay, color=carrier))+geom_histogram()

ggplot(flights, aes(x=arr_delay,color=carrier))+geom_freqpoly()

ggplot(flights,aes(y=arr_delay,color=carrier))+geom_boxplot()

#h facetting
ggplot(flights,aes(x=arr_delay,color=carrier,shape = carrier))+geom_histogram()+
  labs(title="histogram")+facet_wrap(~carrier)


