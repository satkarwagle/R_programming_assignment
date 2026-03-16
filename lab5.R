sales <- data.frame(
  InvoiceNo = c(1, 1, 2, 2, 3),
  Product = c("Pen", "Pencil", "Pen", "Notebook",
              "Pencil"), Quantity = c(2, 1, 1, 3, 2),
  Price = c(1.5, 0.5, 1.5, 2.0, 0.5),
  CustomerID = c(101, 101, 102, 103, 104),
  Country = c("UK", "UK", "UK", "USA", "USA")
)
sales

#1. View the first few rows of the dataset using head().
head(sales,2)

#2. How many rows and columns does the dataset have? (Use dim())
dim(sales)

#3. What are the column names of the data frame? (Use colnames())
colnames(sales)

#4. What type of object is sales? (Use class() or str())
class(sales)

#5. Find the total number of sales (rows). (Use nrow)
nrow(sales)

#6. How many unique products are there? (Hint: length(unique())
length(unique(sales$Product))

#7. Which products were sold? (List distinct values in the Product column.)
unique(sales$Product)

#8. Filter rows where the product is "Pen". (Use: subset())
subset(sales, Product == "Pen")

#9. Filter sales where Quantity > 1.
subset(sales,Quantity > 1)

#10.Create a new column called TotalPrice that multiplies Quantity *Price.
sales$TotalPrice <- sales$Quantity * sales$Price
sales

#11.What is the total revenue from all sales?
sum(sales$TotalPrice)

#12.Find total quantity sold per product.
aggregate(Quantity ~ Product, data = sales, sum)

#13.What is the average price per product?
aggregate(Price ~ Product, data = sales, mean)

#14.Who are the unique customers (CustomerID)?
unique(sales$CustomerID)

#15.Group by Country and find total quantity sold in each.
aggregate(Quantity ~ Country, data = sales, sum)

#16.Which product had the highest total quantity sold?
totals <- aggregate(Quantity ~ Product, data= sales, sum)
subset(totals, totals$Quantity == max(totals$Quantity))

#17.Find which invoice had the most total quantity sold.
 High<- aggregate(Quantity ~ InvoiceNo, data = sales, sum)
 max_invoice <- High[High$Quantity == max(High$Quantity),]
 max_invoice




