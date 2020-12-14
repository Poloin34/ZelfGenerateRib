async function GenerateDoc() {
  const formUrl = 'pdf.pdf'
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())


  const pdfDoc = await PDFLib.PDFDocument.load(formPdfBytes)

  const form = pdfDoc.getForm()

  const nom_prenom = form.getTextField('nom_prenom')
  const addresse_rue = form.getTextField('adresse_rue')
  const addresse_cpville = form.getTextField('adresse_cp-ville')
  const iban_codeeta = form.getTextField('iban_code-eta')
  const iban_codeguichet = form.getTextField('iban_code-guichet')
  const iban_accnumber = form.getTextField('iban_acc-number')
  const iban_clerib = form.getTextField('iban_clerib')
  const iban_full = form.getTextField('iban_full')
  const date = form.getTextField('date_of_the_day')

  nom_prenom.setText(document.getElementById("name").value)
  addresse_rue.setText(document.getElementById("addressStreet").value)
  adresse_cpville.setText(document.getElementById("addressZipcode").value + document.getElementById("addressCity").value)
  
  iban = document.getElementById("iban").value
  ibanETA = iban.substr(0,iban.length-22)
  ibanGUICHET = iban.substr(5, iban.length-17)
  ibanACC = iban.substr(10, iban.length-6)
  ibanKEY = iban.substr(25, iban.length)



  iban_codeeta.setText(ibanETA)
  iban_codeguichet.setText(ibanGUICHET)
  iban_accnumber.setText(ibanACC)
  iban_clerib.setText(ibanKEY)
  iban_full.setText(iban)
  
  date.setText(daydate)

  const pdfBytes = await pdfDoc.save()
}