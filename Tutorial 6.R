install.packages("nycflights13")
install.packages("dplyr")
library(nycflights13)
library(dplyr)

#1
flights_df <- as.data.frame(flights)
#2
flights_selected <- flights_df %>%
  select(year, month, day, arr_time, arr_delay, carrier,
         origin, dest, hour, minute, distance, air_time)
#3
flights_unique <- flights_selected %>%
  distinct()

#4
flights_filtered <- flights_unique %>%
  filter(air_time > 200,
         dest == "DEN",
         arr_delay > 0)
#5
num_rows <- nrow(flights_filtered)
num_rows
#6

flights_arranged <- flights_filtered %>%
  arrange(desc(month))
#7
avg_hour_by_carrier <- flights_arranged %>%
  group_by(carrier) %>%
  summarise(avg_hours = mean(air_time / 60, na.rm = TRUE))

avg_hour_by_carrier

#8
avg_airtime_clt_lga <- flights_df %>%
  filter(dest == "CLT", origin == "LGA") %>%
  summarise(avg_air_time = mean(air_time, na.rm = TRUE))

avg_airtime_clt_lga

