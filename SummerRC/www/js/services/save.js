var app = angular.module('mealtrack.services.meals', []);

app.service("MealService", function ($q) {
	var self = {
// These 7 vars are only used for loading feeds like Facebook or Yik Yak
//		'page': 0,
//		'page_size': 20,
//		'isLoading': false,
//		'isSaving': false,
//		'hasMore': true,
//		'results': [],
// Similarly refresh is used in ionic on a pull down for apps with data feeds
//		'refresh': function () {
//			self.page = 0;
//			self.isLoading = false;
//			self.isSaving = false;
//			self.hasMore = true;
//			self.results = [];
//			return self.load();
//		},
// Next page load for apps with data feeds
//		'next': function () {
//			self.page += 1;
//			return self.load();
//		},
// loading remote data feeds
//	'load': function () {
//			self.isLoading = true;
//			var d = $q.defer();

			//TODO

//			return d.promise;
//		},
		'track': function (data) {
			self.isSaving = true;
		//A promise variable to ensure that the data is correctly saved
			var d = $q.defer();
		//Creates table in parse for ScoreData
			var ScoreData = Parse.Object.external("ScoreData");
		//Creates row in above table with the data			
			var scores = new Scores();
		// Save media: var file = data.picture ? new Parse.File("photo.jpg", {base64: data.picture}) : null;
		
		scores.set("localEmail", user);
	// Need to iterate over questions
		scores.set("questionID", questionID);
		scores.set("contextGrp", contextGroup);
		scores.set("studentResponse", studentAnswer);
		scores.set("score", studentScore);
				
		scores.save(null, {
			success: function () {
		//The return of the promise variable to ensure that the data is correctly saved
			return d.promise;				
			},
			error: function (item, error) {
				d.reject(error);
			}
		})

		}

	};

	return self;
});