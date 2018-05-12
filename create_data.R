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

eight_year_smallpox <- us_contagious_diseases %>%
  filter(disease == "Smallpox") %>%
  group_by(state, (year) %/% 8) %>%
  summarize(start_year = min(year), cases_per_1m = 1000000 * sum(count) / sum(population))

library(geojsonio)
states <- geojson_read("data/us-states.geojson", what = "sp")

smallpox_1928_geojson <- states
smallpox_1936_geojson <- states
smallpox_1944_geojson <- states
smallpox_1952_geojson <- states

smallpox_1928_geojson <- sp::merge(smallpox_1928_geojson, 
                                   eight_year_smallpox[eight_year_smallpox$start_year == 1928, 
                                                       c("state", "start_year", "cases_per_1m")], 
                                   by.x = "NAME", by.y = "state", all.x = TRUE)

smallpox_1936_geojson <- sp::merge(smallpox_1936_geojson, 
                                   eight_year_smallpox[eight_year_smallpox$start_year == 1936, 
                                                       c("state", "start_year", "cases_per_1m")], 
                                   by.x = "NAME", by.y = "state", all.x = TRUE)

smallpox_1944_geojson <- sp::merge(smallpox_1944_geojson, 
                                   eight_year_smallpox[eight_year_smallpox$start_year == 1944, 
                                                       c("state", "start_year", "cases_per_1m")], 
                                   by.x = "NAME", by.y = "state", all.x = TRUE)

smallpox_1952_geojson <- sp::merge(smallpox_1952_geojson, 
                                   eight_year_smallpox[eight_year_smallpox$start_year == 1952, 
                                                       c("state", "start_year", "cases_per_1m")], 
                                   by.x = "NAME", by.y = "state", all.x = TRUE)

geojson_write(smallpox_1928_geojson, geometry = "polygon", file = "data/smallpox_1928.geojson")

geojson_write(smallpox_1936_geojson, geometry = "polygon", file = "data/smallpox_1936.geojson")

geojson_write(smallpox_1944_geojson, geometry = "polygon", file = "data/smallpox_1944.geojson")

geojson_write(smallpox_1952_geojson, geometry = "polygon", file = "data/smallpox_1952.geojson")


mmr <- us_contagious_diseases %>%
  filter(disease %in% c("Mumps", "Measles", "Rubella") & population > 0) %>%
  group_by(disease, year) %>%
  summarize(cases_per_100k = 100000 * sum(count) / sum(population)) %>%
  spread(disease, cases_per_100k) %>%
  filter(!is.na(Measles + Mumps + Rubella))

write.csv(mmr, "data/mmr.csv", row.names = FALSE)
