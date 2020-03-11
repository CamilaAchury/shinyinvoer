
library(shiny)
library(shinyinvoer)
library(purrr)


images <- c(
  'https://via.placeholder.com/150x50/808080',
  'https://via.placeholder.com/150x50/A000FF',
  'https://via.placeholder.com/150x50/0080A0'
)
choices <- c('a', 'b', 'c')
named_choices <- c("Ahh!" = "a", "Buu!" = "b", "Cool"="c")

ui <- fluidPage(
  #suppressDependencies('bootstrap'),
  selectImageInput("dropdown1", "Select Image", choices = choices, images = images, width = 100),
  verbatimTextOutput('test1'),
  hr(),
  selectImageInput("dropdown2", "Named choices", choices = named_choices, images = images, width = 50),
  verbatimTextOutput('test2'),
  hr(),
  selectImageInput("dropdown3", "With custom placeholder", choices = choices,
                   placeholder = img(src = "https://via.placeholder.com/150x50"),
                   images = images, width = 50),
  verbatimTextOutput('test3'),
  uiOutput("test")

)

server <- function(input, output, session) {

  output$test1 <- renderPrint({
    input$dropdown1
  })
  output$test2 <- renderPrint({
    input$dropdown2
  })
  output$test3 <- renderPrint({
    input$dropdown3
  })
  output$test <- renderUI({
    selectInput("custom_selected", "Choose an option", c("none","a", "b", "c"))
  })
  observe({
    if (is.null(input$custom_selected)) {
      return()
    } else {
      print(input$custom_selected)
      updateSelectImageInput(session, "dropdown1", selected = input$custom_selected)
    }
  })
}

shinyApp(ui, server)