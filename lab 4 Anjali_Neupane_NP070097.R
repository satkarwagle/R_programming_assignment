setwd("C:/Users/SAMSUNG/Downloads")
getwd()
#install garnu parxa
install.packages("readxl")
library(readxl)

retail<-read_excel("Online Retail.xlsx")
retail
#How many unique products in the store?
length(unique(retail$StockCode))
#data cleaning
retail_clean <- retail[!is.na(retail$CustomerID)&retail$Quantity>0,]
length(unique(retail_clean$StockCode))
#Find the five most sold products.
product<-aggregate(Quantity ~ StockCode, data = retail_clean, sum)
product
top_5<-product[order(-product$Quantity),]# sort descending
head(top_5,5) 

#Find the products that have different descriptions.
desc_diff<-aggregate(Description~StockCode,data=retail_clean,function(x)length(unique(x)))
desc_diff

desc_check<-desc_diff[desc_diff$Description>1,]
desc_check


#Most popular product for each country
Country_product <- aggregate(Quantity ~ Country + StockCode, data = retail_clean, sum)
Country_product
unique_Countries <- unique(Country_product$Country)

for(c in unique_Countries){
  one_Country <- Country_product[Country_product$Country == c,]
  top_product <- one_Country[order(-one_Country$Quantity),]
  print(head(top_product,1))
}
#. Which two products customers often purchase together?

invoice_product <- split(retail_clean$StockCode, retail_clean$InvoiceNo)
invoice_product <- lappy(invoice_product,unique)
trans <- as(invoice_product,"transactions")
rules <- apriori(trans, parameter = list(supp = 0.01, conf = 0.5))
inspect(head(sort(rules, by = "lift"), 5))
