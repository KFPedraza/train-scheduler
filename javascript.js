// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDnPVplpsxrG2Jo4f1bPqPleZzc-HOVhLE",
    authDomain: "train-schedule-48071.firebaseapp.com",
    databaseURL: "https://train-schedule-48071.firebaseio.com",
    storageBucket: "train-schedule-48071.appspot.com",
    messagingSenderId: "251264626641"
  };
  firebase.initializeApp(config);

var database = firebase.database();

//Train information input values pushed to database
$("#submitTrain").on('click', function() {
	var nameOfTrain = $("#nameOfTrain").val().trim();
	var destinationTrain = $("#destinationTrain").val().trim();
	var frequencyTrain = $("#frequencyTrain").val().trim();
	var firstTrain = $("#firstTrain").val().trim();

	database.ref().push({
		name: nameOfTrain,
		destination: destinationTrain,
		frequency: frequencyTrain,
		firstTrain: firstTrain
	});

	//clear form after submission
	$("#nameOfTrain").val("");
	$("#destinationTrain").val("");
	$("#frequencyTrain").val("");
	$("#firstTrain").val("");

	//don't refresh page
	return false;
});

//Populate trains from database, next arrival and minutes away calculations
database.ref().orderByChild("dateAdded").limitToLast(50).on("child_added", function (snapshot) {

	var frequency = snapshot.val().frequency;

	var firstTrain = snapshot.val().firstTrain;
	var firstTrainConverted = moment(firstTrain,"hh:mm").subtract(1, "years");
	var difference = moment().diff(moment(firstTrainConverted), "minutes")
	var currentTime = moment();
	var remainder = difference % frequency;
	var minutesAway = frequency - remainder;
	var nextArrival = moment().add(minutesAway, "minutes");

	var td1 = $("<td>").html(snapshot.val().name);
	var td2 = $("<td>").html(snapshot.val().destination);
	var td3 = $("<td>").html(snapshot.val().frequency);
	var td4 = $("<td>").html(moment(nextArrival).format("hh:mm"));
	var td5 = $("<td>").html(minutesAway);

	var newRow = $("<tr>");
    newRow.append(td1, td2, td3, td4, td5)

      $("#trainTable").append(newRow);
});