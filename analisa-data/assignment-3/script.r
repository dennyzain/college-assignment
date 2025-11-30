library(shiny)
library(ggplot2)
library(dplyr)
library(DT)
library(readxl)

# Load dataset weather benar
raw <- read_excel("Tugas 3 - weather.xlsx", col_names = FALSE)
names(raw) <- as.character(raw[1, ])
data <- raw[-1, ]

# Convert numeric columns
data <- data %>% mutate(across(where(\(x) all(grepl("^[0-9.]+$", x, perl=TRUE))), as.numeric))

ui <- fluidPage(
    titlePanel("Aplikasi Visualisasi Data Cuaca (Weather)"),

    sidebarLayout(
        sidebarPanel(
            selectInput("var_x", "Pilih Variabel X:",
                        choices = names(data), selected = names(data)[1]),

            selectInput("var_y", "Pilih Variabel Y:",
                        choices = names(data), selected = names(data)[2]),

            selectInput("plot_type", "Pilih Jenis Visualisasi:",
                        choices = c("Scatter Plot", "Line Plot", "Bar Plot", "Tabel Data"))
        ),

        mainPanel(
            uiOutput("output_ui")
        )
    )
)

server <- function(input, output) {

    output$output_ui <- renderUI({
        if (input$plot_type == "Tabel Data") {
            dataTableOutput("table")
        } else {
            plotOutput("plot")
        }
    })

    output$plot <- renderPlot({
        req(input$var_x)

        # kalau tabel, skip y
        if (input$plot_type != "Bar Plot") req(input$var_y)

        x <- data[[input$var_x]]
        y <- data[[input$var_y]]

        if (input$plot_type == "Scatter Plot") {
            ggplot(data, aes_string(x = input$var_x, y = input$var_y)) +
                geom_point() +
                labs(title = "Scatter Plot",
                     x = input$var_x,
                     y = input$var_y)

        } else if (input$plot_type == "Line Plot") {
            ggplot(data, aes_string(x = input$var_x, y = input$var_y)) +
                geom_line() +
                labs(title = "Line Plot",
                     x = input$var_x,
                     y = input$var_y)

        } else if (input$plot_type == "Bar Plot") {
            ggplot(data, aes_string(x = input$var_x)) +
                geom_bar(fill = "orange") +
                labs(title = "Bar Plot",
                     x = input$var_x,
                     y = "Count")
        }
    })

    output$table <- renderDataTable({
        datatable(data)
    })
}

shinyApp(ui = ui, server = server)