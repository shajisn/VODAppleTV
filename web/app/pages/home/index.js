import ATV from 'atvjs';
import template from './template.hbs';
import API from 'lib/api';

function getJson(url) {
    return new Promise(
        (resolve, reject) => {
            ATV.Ajax.get(url).then(
                (value) => {
                    resolve(value);
                },
                function (reason) {
                    console.error(reason);
                    reject(new Error(reason));
                }
            )
        }
    )
}

function createSectionStr(sectionObj){	

	// let sectionStr = '<section>'
	// sectionStr += '{{#each railItems }}'
	// sectionStr += '<lockup data-href-page="movie-details" data-href-page-options="{{toJSON this }}">'
	// sectionStr += '<img class="tile" src="{{poster_url poster_path }}"/>'
	// sectionStr += '<title class="showAndScrollTextOnHighlight">{{ title  }}</title>'
	// sectionStr += '</lockup>{{/each}}</section>'
	// return sectionStr

    let lockupStr = '<section id = "' + sectionObj.title + '" binding = "items:{images};"><prototypes><lockup prototype="'
    lockupStr += sectionObj.title
    lockupStr += '"><img binding="@src:{url};" class="tile" />'
    lockupStr += '<title binding="textContent:{title};"/></lockup></prototypes></section>'
    return lockupStr
}


function createShelfElement(doc, collectionList, shelfObj) {
    let shelfTemplate = '<shelf><header><title>'
    shelfTemplate += shelfObj.title
    shelfTemplate += '</title></header>'
    shelfTemplate += createSectionStr(shelfObj)
    shelfTemplate += '</shelf>'
    console.log(shelfTemplate)
    collectionList.insertAdjacentHTML('beforeend', shelfTemplate)
    

    getJson(API.popularMovies).then(
	    (value) => {
	        console.log("RailItem JSON: %o", value)
			var section = doc.getElementById(shelfObj.title)
			section.dataItem = new DataItem()
			let movies = value.response;
			var railItemList = movies.results
			console.log("RailItem Result: %o", railItemList)
			var rails = []

			railItemList.forEach(function(railItem) { 

				console.log("RailItem : %o", railItem)
				let objectItem = new DataItem(shelfObj.title, railItem.id);
				objectItem.url = "http://image.tmdb.org/t/p/w500" + railItem.poster_path
				objectItem.title = railItem.title
				rails.push(objectItem);
			});

		    console.log("Rails: %o", rails)

			section.dataItem.setPropertyPath("images", rails)
	    },
	    function (reason) {
	        console.error(reason);
	    }
	);

 //    let getPopularMovies = ATV.Ajax.get(API.popularMovies);
	// var railItems
	// Promise
	// 	.all([getPopularMovies])
	// 	.then((xhrs) => {
	// 		let railItemsObj = xhrs[0].response;			

	// 		railItems: railItemsObj.results
	// 	}, (xhr) => {
	// 		// error
	// 		reject();
	// 	})


	// console.log("RailItem JSON: %o", railItems)

	

    return shelfTemplate
}

var homeContent

var HomePage = ATV.Page.create({
	name: 'home',
	template: template,
	// ready(options, resolve, reject) {
	// 	let getPopularMovies = ATV.Ajax.get(API.popularMovies);
	// 	let getPopularTvShows = ATV.Ajax.get(API.popularTvShows);

		// Promise
		// 	.all([getPopularMovies, getPopularTvShows])
		// 	.then((xhrs) => {
		// 		let movies = xhrs[0].response;
		// 		let tvShows = xhrs[1].response;

		// 		resolve({
		// 			movies: movies.results,
		// 			tvShows: tvShows.results
		// 		});
		// 	}, (xhr) => {
		// 		// error
		// 		reject();
		// 	})
	// },

	ready(options, resolve, reject) {
		console.log("Inside Ready...")
		let getHomeJson = ATV.Ajax.get('http://localhost:9001/assets/json/home.json')
		Promise
			.all([getHomeJson])
			.then((xhrs) => {
				homeContent = xhrs[0].response;
				console.log("Home JSON: %o", homeContent)
				resolve({
					homeContent: homeContent,
				});
			}, (xhr) => {
				// error
				reject();
			})
	},

	afterReady(doc) {

		console.log("after readt")
        var stackTemplate = doc.getElementsByTagName("stackTemplate").item(0)
	    var collectionList = stackTemplate.getElementsByTagName("collectionList").item(0)
	   
	    //create an empty data item for the section
	    collectionList.dataItem = new DataItem()
	    var results = homeContent
	    var railList = results["content"]["rail_list"]
	    var shelfItems = railList.map((railList) => {
	                                  let objectItem = new DataItem("Home", railList.rail_type_name);
	                                  objectItem.title = railList.rail_type_name
	                                  objectItem.url = railList.rail_item_url
	                                  createShelfElement(doc, collectionList, objectItem)
	                                  return objectItem;
	                                  });
	    console.log(shelfItems)
	    collectionList.dataItem.setPropertyPath("rails", shelfItems)
		
	},

});

export default HomePage;