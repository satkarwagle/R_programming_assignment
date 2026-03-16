code = c(101,101,102,102)
desc = c("Red Book","Blue Book","Book","Book")
df = data.frame(code,desc)


aggregate(code ~ desc, data = df, sum)#sum

aggregate(desc ~ code, data = df, function(x)length(x))
#quwstion 1
customerid = c(101,101,102,103,102,101)
invoice = c("IN1","IN2","IN3","IN4","IN1","IN2")
df = data.frame(customerid, invoice)
#count unique invoice per customer.
aggregate(invoice~ customerid,data=df,function(x)length(unique(x)))

#question 2
country = c("Nepal","Nepal","India","India","Nepal")
revenue = c(105,500, 739, 632, 935)
df = data.frame(country,revenue)

#total revenue per country.
aggregate(revenue~ country,data=df,sum)



