let from = document.body.querySelector('#from');
let to = document.body.querySelector('#to');
const currency_inputs = document.body.querySelectorAll('input[type="text"]');

// Mettre à jour data-base des inputs quand une option est sélectionnée
from.addEventListener('change', () => {
  currency_inputs[0].dataset.base = from.value;
});

to.addEventListener('change', () => {
  currency_inputs[1].dataset.base = to.value;
});


currency_inputs.forEach((currency_input) =>
  currency_input.addEventListener("input", getCurrentiesValues),
);

function getCurrentiesValues() {
  let user_value_string = this.value;

  if (!/^[0-9]+[.,]?[0-9]*$/.test(user_value_string)) {
    this.value = "";
    return;
  }

	const user_value_number = parseFloat(user_value_string.replace(/,/, "."));
	const base = this.dataset.base;

	fetch(`https://api.frankfurter.dev/v2/rates?base=${base}`)
		.then((Response) => Response.json())
		.then((data) => getFilteredData(data, user_value_number, base))
		.catch((error) => console.error(`Une erreur est survenue: ${error}`));
}

function getFilteredData(data, user_value_number, base){
	const currencies_data = extractDesiredData(data);
    currency_inputs.forEach(currency_input => {
		const currency_to = currencies_data.find((currency_data) =>
			currency_input.dataset.base === currency_data.quote);
		
		if( currency_to && currency_input.dataset.base !== base) {
			currency_input.value = (currency_to.rate * user_value_number).toFixed(2);
		}
	})
}

function extractDesiredData(data){
	return data.map((currency) =>  {
			return {
				quote: currency.quote,
				rate: currency.rate
			};
		});
}

async function getData() {
	const url = 'https://api.frankfurter.dev/v2/rates';
	try {
		const reponse = await fetch(url);
		if (!reponse.ok) {
		throw new Error(`Statut de réponse : ${reponse.status}`);
		}

		const data = await reponse.json();
		const allQuotes = data.map((currency) =>  {
			return {
				quote: currency.quote
			}
		});

		for(x in allQuotes){
			const currenciesFrom = document.createElement('option');
			const currenciesTo = document.createElement('option');

			currenciesFrom.textContent = allQuotes[x].quote;
			currenciesTo.textContent = allQuotes[x].quote;

			from.appendChild(currenciesFrom);
			to.appendChild(currenciesTo);
		}
	} catch (erreur) {
		console.error(erreur.message);
	}
}


getData();