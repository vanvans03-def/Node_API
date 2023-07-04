const express = require('express');
const app = express();
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const htmlToPdf = require('html-pdf-node');
const em = 'teerahitchana@gmail.com';
const pass ='Lover2ne1!';

var order = [{
    id: 1,
    name: "ส้ม",
    count: 5
},
{
  id: 2,
  name: "มะม่วง",
  count: 5
},
{
  id: 3,
  name: "มะนาว",
  count: 5
}
];




app.post('/sendmail', async (req, res) => {
  try {
    const pdfBuffer = await generatePdf();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: em,
        pass: pass,
      },
    });

    const mailOptions = {
      from: em,
      to: 's6403052422141@email.ac.th',
      subject: 'มีออเดอร์มาใหม่',
      text: 'Please find the attached PDF',
      attachments: [
        {
          filename: 'generated.pdf',
          content: pdfBuffer,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(400).json({
          RespCode: 400,
          RespMessage: 'Bad Request',
          RespError: error,
        });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).json({
          RespCode: 200,
          RespMessage: 'Email sent successfully',
        });
      }
    });
  } catch (error) {
    console.log('Error generating PDF:', error);
    return res.status(500).json({
      RespCode: 500,
      RespMessage: 'Internal Server Error',
      RespError: error,
    });
  }
});

async function generatePdf() {
  const htmlPdf = await ejs.renderFile(
    "./view/layout.html.ejs",
    { rows: order },
    { async: true }
  );

  const options = { format: 'A4' };
  const file = { content: htmlPdf };

  const pdfBuffer = await htmlToPdf.generatePdf(file, options);
  return pdfBuffer;
}

module.exports = app;
