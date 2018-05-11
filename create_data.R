library(dplyr)

library(dslabs)
data(us_contagious_diseases)

us_contagious_diseases$imputed_cases_per_100k <- 100000 * 
  coalesce(
    us_contagious_diseases$count / 
      (us_contagious_diseases$weeks_reporting / 52
      ), 0
  ) / us_contagious_diseases$population

us_contagious_diseases$cases_per_100k <- 100000 *
  us_contagious_diseases$count / 
  us_contagious_diseases$population


us_contagious_diseases %>%
  filter(disease == "Smallpox") %>%
  write.csv("data/smallpox.csv")