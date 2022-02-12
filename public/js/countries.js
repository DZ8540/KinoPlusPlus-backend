fetch('https://restcountries.com/v3.1/all')
  .then(res => res.json())
  .then(data => {
    let select = document.querySelector('#countries')

    for (let item of data) {
      select.insertAdjacentHTML('beforeend', `<option>${item.name.common}</option>`)
    }
  })
