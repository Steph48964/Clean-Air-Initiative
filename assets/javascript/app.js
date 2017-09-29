
var cities = 	["ALBERTA",
					"Atlanta-Sandy Springs-Marietta",
               "Bogota",
               "Brandenburg",
               "Chengdu",
               "Delhi",
               "El Bosque",
               "İstanbul",
               "Kansas City",
               "Jakarta",
               "Lisboa",
               "London",
               "Los Angeles-Long Beach-Santa Ana",
               "Minneapolis-St. Paul-Bloomington",
               "NEW YORK",
               "Oost-Vlaanderen",
               "Osasco",                 
              	"Oslo",
               "Roma",
               "San Antonio",
               "Seattle-Tacoma-Bellevue",
               "South East Queensland",
               "Středočeský",
               "Tampa-St. Petersburg-Clearwater",
               "Ulaanbaatar"];

var description;
var images = [];
var input;

var countriesList = [
	{
		id: "Toronto Downtown",
		value: 0,
	},
	{
		id: "Beijing",
		value: 0
	},
	{
		id: "Chengdu",
		value: 0
	},
	{
		id: "Jakarta",
		value: 0
	},
	{
		id: "Tehran",
		value: 0
	},
	{
		id: "Ulaanbaatar",
		value: 0
	}, 
	{
		id: "Lahore",
		value: 0
	},
	{
		id: "Lima",
		value: 0
	},
	{
		id: "Vienna",
		value: 0
	}, 
	{
		id: "Busan",
		value: 0
	},
	{
		id: "Warsaw",
		value: 0
	},
	{
		id: "Kolkata",
		value: 0
	},
	{
		id: "Manila",
		value: 0
	},
	{
		id: "Osaka",
		value: 0
	},
	{
		id: "Riyadh",
		value: 0
	},
	{
		id: "Munich",
		value: 0
	},
	{
		id: "Moscow",
		value: 0
	},
	{
		id: "London",
		value: 0
	},
	{
		id: "Santiago",
		value: 0
	},
	{
		id: "Sao Paulo",
		value: 0
	},
	{
		id: "Nice",
		value: 0
	},
	{
		id: "Los Angeles",
		value: 0
	},
	{
		id: "Ankara",
		value: 0
	},
	{
		id: "Jerusalem",
		value: 0
	},
	{
		id: "Sydney",
		value: 0
	},
	{
		id: "Madrid",
		value: 0
	},
	{
		id: "Prague",
		value: 0
	},
	{
		id: "Oslo",
		value: 0
	},
	{
		id: "Helsinki",
		value: 0
	},
	{
		id: "Richards Bay",
		value: 0
	},
	{
		id: "Budapest",
		value: 0
	},
	{
		id: "Matosinhos",
		value: 0
	},
	{
		id: "Bogota",
		value: 0
	},
	{
		id: "Dhaka",
		value: 0
	},
	{
		id: "Brasov",
		value: 0
	},
	{
		id: "Phnom Penh",
		value: 0
	},
	{
		id: "Port Harcourt",
		value: 0
	},
	{
		id: "Hanoi",
		value: 0
	},
	{
		id: "Busan",
		value: 0
	},
	{
		id: "Brussels",
		value: 0
	},
	{
		id: "Beograd",
		value: 0
	},
	{
		id: "Vilnius",
		value: 0
	},
	{
		id: "Rotterdam",
		value: 0
	},
	{
		id: "Beograd",
		value: 0
	}
];

var config = {
	apiKey: "AIzaSyCWlmhjcyuT8F60G7LcgbyI1zIY1IfhS5I",
	authDomain: "air-pollution-c03c3.firebaseapp.com",
	databaseURL: "https://air-pollution-c03c3.firebaseio.com",
	projectId: "air-pollution-c03c3",
	storageBucket: "air-pollution-c03c3.appspot.com",
	messagingSenderId: "229702085661"
};

firebase.initializeApp(config);

var database = firebase.database();

var cityAQ = 0;

var queryURL = "https://api.airvisual.com//v2/city_ranking?key=7nsRkFTrepCQ4LCmX";

$.ajax ({
	url: queryURL,
	method: "GET"
})
	
	.done(function(response) {

		for (var i = 0; i < response.data.length ; i++ ) {
			var hold = response.data[i];
			var city = hold.city;
			var state = hold.state;

			for (var j = 0; j < countriesList.length; j++) {
				if (city === countriesList[j].id){
					countriesList[j].value = response.data[i].ranking.current_aqi;
				};

				if (state === countriesList[j].id) {
					countriesList[j].value = response.data[i].ranking.current_aqi;
				}  
			}
		}

		render();
	
	});

function render() {
	AmCharts.makeChart("mapdiv", {
		type: "map",
		theme: "light",
		colorSteps: 10,

		dataProvider: {
			map: "worldHigh",
			areas: countriesList,
			images: images
		},

		areasSettings: {
			autoZoom: false,
			selectable: true
		},

		valueLegend: {
			right: 10,
			minValue: "Healthy",
			maxValue: "Hazardous"
		}
	});
};

var secondAPI = function(input) {
	var queryURL = "https://api.openaq.org/v1/latest?city=" + input;
	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response) {
	
		for (var y = 0; y < response.results[0].measurements.length; y++) {
			var parameter = response.results[0].measurements[y].parameter;
			var value = response.results[0].measurements[y].value;
			var unit = response.results[0].measurements[y].unit; 
			des = (parameter + " = " + value +" " + unit );
		};
		
		var box = new Object();
		box.label = " ";
		box.title = response.results[0].city;
		box.latitude = response.results[0].coordinates.latitude;
		box.longitude = response.results[0].coordinates.longitude;
		box.type = "circle";
		box.alpha = 0.7;
		box.scale = 0.9;
		box.selectable = true;		
		box.description = des;
		images.push(box);

		render();
	});
};

var retrieve = function() {
	database.ref().on("child_added", function(snapshot) {
		country = snapshot.val().country;
		cityAQ = snapshot.val().cityAQ;
		city = snapshot.val().city;

		var row = $("<tr>");
		row.append("<td>" + cityAQ + "</td>");
		row.append("<td>" + city + "</td>");
		row.append("<td>" + country + "</td>");
		
		$("#tbody").append(row);
	}, 

		function(errorObject){

		});
};

retrieve();

$(function () {
	var list = document.getElementById("citiesList");
	cities.forEach(function(item) {
		var option = document.createElement("option");
		option.value = item;
		list.appendChild(option);
	});
});

$("#submit").on("click", function(event) {
   event.preventDefault();
   input = $("#keyWord").val();
   var inputIndex = cities.indexOf(input);
   $("#keyWord").val(" ");

   if (inputIndex > 0) {
      secondAPI(cities[inputIndex]);
        
   } else {
      $("#myModal").modal();
   }
})

