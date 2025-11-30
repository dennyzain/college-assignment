
# nomor 1
ggplot(data, aes(x = kebahagiaan)) +
     geom_histogram(bins = 30, fill = "lightblue", color = "black") +
     labs(title = "Histogram Variabel Kebahagiaan",
          x = "Kebahagiaan",
          y = "Frekuensi")

# nomor 2
ggplot(data, aes(x = pendapatan, y = kepuasan)) +
  geom_point() +
  labs(title = "Scatter Plot Pendapatan vs Kebahagiaan",
       x = "Pendapatan",
       y = "Kebahagiaan")

# nomor 3
model <- lm(kebahagiaan ~ pendapatan, data = data)
summary(model)


# nomor 4
plot(model)


# nomor 5
ggplot(data, aes(x = pendapatan, y = kebahagiaan)) +
  geom_point(color = "blue") +
  geom_smooth(method = "lm", se = FALSE, color = "red") +
  stat_regline_equation(
    aes(label = ..eq.label..),
    label.x = min(data$pendapatan),
    label.y = max(data$kebahagiaan)
  ) +
  labs(
    title = "Regresi Linear: Pendapatan vs Kebahagiaan",
    x = "Pendapatan",
    y = "Kebahagiaan"
  )