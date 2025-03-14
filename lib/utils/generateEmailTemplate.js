const express = require("express");
const exphbs = require("express-handlebars");
const fs = require("fs");
const path = require("path");

// Function to compile .hbs template into an HTML string
async function generateEmailTemplate(data, templateName) {
  const hbs = exphbs.create();

  // Read the template file from the file system (assuming the templates are stored in a 'views' directory)
  const templatePath = path.join(__dirname, "views", `${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, "utf8");

  // Compile the template using Handlebars
  const compiledTemplate = hbs.compile(templateSource);

  // Generate the HTML string by passing the data
  const result = compiledTemplate(data);

  return result;
}

// Example usage
const data = {
  name: "John Doe",
  email: "john.doe@example.com",
  message: "This is a test email message generated with Handlebars!",
};

generateEmailTemplate(data, "emailTemplate")
  .then((html) => {
    console.log(html); // Here you get the generated HTML content for email
  })
  .catch((error) => {
    console.error("Error generating email template:", error);
  });
