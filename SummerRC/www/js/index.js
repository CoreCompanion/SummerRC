// Global Variables
var jsonData = null;
var totalChapters = 0;
var totalQuestions = -1;
var chapterID = -1;
var questionID = -1;
var siteID = -1;
var answerID = -1;
var currentScore = 0;
var contextGrp = null;
var contextGrp2 = null;
var keyGrpLen = 0;
var ansKey = [];
var ans2Key = [];
var correctAns = -1;
var selectedAnswer = -1;
var queFormat = -1;
var jsonObj = [];
var boolCheck = 0;
var stuAns1 = null;
var stuAns2 = null;
var text_value = null;
var loop2 = 0;
var subQuest = null;
var varScore = 0;
var varScore2 = 0;
var storage = window.localStorage;
var visitChap = 0;




$(document).on('mobileinit', function () {
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
});


$(document).ready(function () {
    FastClick.attach(document.body);

 //   Parse.initialize("oe3dboiG0RzJNULxKvdHYGWEb3Cq7mzHRC3Dwh6E", "cR8whmMjybMoXUqfAzhxUJSiBXw3QPt7ZB4bRGw8");


    $("#home_page").on('touchmove', function (ev) {
        ev.preventDefault();
    });

    // Disable touch scrolling on the questions page
    $("#questions_page").on('touchmove', function (ev) {
        ev.preventDefault();
    });

    $(document).on('deviceready', onDeviceReady);
});


function onDeviceReady() {
    // AJAX call to get JSON data containing the chapters and question	
    var path = window.location.href.replace('index.html', '');
    alert("device ready");
    $.ajax({
        //   url: path + "sample.json",
        url: "http://e-ccss.com/sumrd.json",
        dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    }).done(ajaxSuccess).fail(ajaxError);


}


function ajaxSuccess(data) {
    // Save the json data returned to the jsonData global variable
    jsonData = data;
    // Bind event listener to the start button if the JSON data is successfully saved
    if (jsonData != null) {
        $("#Log_in_btn").on('click', validateEmail);
        $("#start_btn").on('click', addAllChapters);
    }

}


function ajaxError(error) {
    alert("Failed to get the chapters data");
}


function addAllChapters() {

    if (visitChap == 0) {
        // Reset all chapters in the list
        if ($("#chapters").children().length > 0) {
            $("#chapters li").remove();
        }
        // Get the total chapters from the chapters array and assign it to totalChapters global variable
        totalChapters = jsonData.test.length;
        loop2 = 0;
        jsonObj = [];

        for (var i = 0; i < totalChapters; i++) {
            // Create a new list item containing each chapters
            var chapter = "<li><a href='#sites_page' class='chapter' id='" + i + "' data-transition='flip'>" + jsonData.test[i].topicId + "</a></li>";

            // Append each chapter to the chapters list
            $("#chapters").append(chapter);
        }

        // Attach click event listener to all added chapters
        $("#chapters li a.chapter").on('click', addAllSites);
    }
    // Refresh the listview widget
    $("#chapters").listview().listview('refresh');
}


function addAllSites(ev) {
    $("#chapter").html(ev.currentTarget.innerHTML);
    if ($("#sites").children().length > 0) {
        $("#sites li").remove();
    }
    $("#sites").empty();

    ChapterID = $(this).attr('id');
    siteID = $(this).attr('id');

    // Get the total answers for the selected question
    totalSites = jsonData.test[siteID].links.length;

    for (var i = 0; i < totalSites; i++) {
        var label = document.createElement('label');
        desc = jsonData.test[siteID].links[i].description;
        label.textContent = desc;
        $("#sites").append(label);
        $("#sites").append('<br>');
        // Create a new list item containing each answers
        var ste = "<li><a href='#' onclick=\"window.open('"+jsonData.test[siteID].links[i].linkY+"', '_system');\">"+jsonData.test[siteID].links[i].linkY+"</a></li>";
        // Append each answer to the answers list
        $("#sites").append(ste);
        $("#sites").append('<br>');
        $("#sites").append('<br>');
    }

    $("#sites").listview().listview('refresh');
    $("#showQuestions").on('click', addAllQuestions);

}


function addAllQuestions(ev) {
    $("#questions").html(ev.currentTarget.innerHTML);
    answerID = -1;
    // Change the chapter title inside the <p> element
 //   $("#chapter").html(ev.currentTarget.innerHTML);

    // Reset all questions in the list
    if ($("#questions").children().length > 0) {
        $("#questions li").remove();
    }

    $("#questions").empty();

    questionID = $(this).attr('id');

    // Get the total answers for the selected question
    totalQuestions = jsonData.test[siteID].questions.length;

    for (var i = 0; i < totalQuestions; i++) {
        // Create a new list item containing each answers
        var answer = "<li data-icon='false'><a href='#answers_page' class='answer' id='" + i + "' data-transition='flip'>" + jsonData.test[siteID].questions[i].question + "</a></li>";

        // Append each answer to the answers list
        $("#questions").append(answer);
    }

    // Attach click event listener to all added questions
    $("#questions li a.answer").on('click', addAllAnswers);

    // Refresh the listview widget
    $("#questions").listview().listview('refresh');
}

function addAllAnswers(ev) {
    boolCheck = 0;
    if (answerID == -1) {
        answerID = $(this).attr('id');
    }
 //   alert(storage.getItem("Student"));
    $("#answer1").html(ev.currentTarget.innerHTML);
    $("#answers_page h1 #MyHeaderID").text("Question: #" + (parseInt(answerID, 10) + 1) + " of " + totalQuestions);

    // Reset all questions in the list
    if ($("#answers").children().length > 0) {
        $("#answers li").remove();
    }
    $("#answers").empty();
    queFormat = jsonData.test[siteID].questions[answerID].questionFormat;

    // Get the correct answer of the selected question
    correctAns = jsonData.test[siteID].questions[answerID].answerId;
    contextGrp = jsonData.test[siteID].questions[answerID].contextGroup1;

    keyGrpLen = jsonData.test[siteID].questions[answerID].keys1.length;
    for (var j = 0; j < keyGrpLen; j++) {
        ansKey[j] = jsonData.test[siteID].questions[answerID].keys1[j];
    }

    if (queFormat == 1 || queFormat == 2) {
        // Get the total answers for the selected question
        var totalAnswers = jsonData.test[siteID].questions[answerID].answers.length;
        for (var i = 0; i < totalAnswers; i++) {
            // Create a new list item containing each answers
            var answer1 = "<li data-icon='false'><a href='#answers_page' class='answer1' id='" + i + "' data-answer='" + correctAns + "' >" + jsonData.test[siteID].questions[answerID].answers[i] + "</a></li>";
            // Append each answer to the answers list

            $("#answers").append(answer1);
        }

        if (queFormat == 2) {
            contextGrp2 = jsonData.test[siteID].questions[answerID].contextGroup2;
            $("#answers").append('<br>');
            var label = document.createElement('label');
            subQuest = "Please enter the first 3 words of the sentence that shows your answer is correct.";
            label.textContent = "Please enter the first 3 words of the sentence that shows your answer is correct.";
            $("#answers").append(label);
            var input = document.createElement('input');
            input.name = "sub3";
            input.type = "text";
            $("#answers").append(input);
        }
    } else if (queFormat == 3 || queFormat == 5) {
        var input = document.createElement('input');
        input.name = "sub1";
        input.type = "text";
        $("#answers").append(input);
    } else if (queFormat == 4) {
        contextGrp2 = jsonData.test[siteID].questions[answerID].contextGroup2;
        var input = document.createElement('input');
        input.name = "sub1";
        input.type = "text";
        $("#answers").append(input);
        $("#answers").append('<br>');
        $("#answers").append('<br>');
        subQuest = jsonData.test[siteID].questions[answerID].subQuestion;
        $("#answers").append(subQuest);
        var key2GrpLen = jsonData.test[siteID].questions[answerID].keys2.length;
        for (var k = 0; k < key2GrpLen; k++) {
            ans2Key[k] = jsonData.test[siteID].questions[answerID].keys2[k];
        }
        var input1 = document.createElement('input');
        input1.name = "sub2";
        input1.type = "text";
        $("#answers").append(input1);
    }
    $("#answers li a.answer1").on('click', testClick);
    if (loop2 == 0) {
        $('.showNxtPage').on('click', nextQuestion);
    }
    $("#answers").listview().listview('refresh');


}

function testClick() {
    selectedAnswer = $(this).attr('id');
}


function checkOption() {
    if (selectedAnswer == correctAns) {
        varScore = 1;
    }
}

function checkTextn(textName, ansArr) {
    text_value = $('input:text[name=' + textName + ']').val();
    for (var k = 0; k < ansArr.length; k++) {
        if (text_value.toLowerCase().indexOf(ansArr[k].toLowerCase()) >= 0) {
            varScore2 = 1;
        }
    }
}

function checkTextnAnd(textName, ansArr) {
    text_value = $('input:text[name=' + textName + ']').val();
    varScore = 1;
    for (var k = 0; k < ansArr.length; k++) {
        if (!(text_value.toLowerCase().indexOf(ansArr[k].toLowerCase()) >= 0)) {
            varScore = 0;
        }
    }
}


function checkAnswer() {
    varScore = 0;
    varScore2 = 0;
    switch (queFormat) {
        case "1":
            checkOption();
            break;
        case "2":
            checkOption();
            checkTextn("sub3", ansKey);
            stuAns2 = text_value;
            break;
        case "3":
            checkTextn("sub1", ansKey);
            if (varScore2 == 1) {
                varScore = 1;
                varScore2 = 0;
            }
            stuAns1 = text_value;
            break;
        case "4":
            checkTextn("sub1", ansKey);
            stuAns1 = text_value;
            checkTextn("sub2", ans2Key);
            stuAns2 = text_value;
            break;
        case "5":
            checkTextnAnd("sub1", ansKey);
            stuAns1 = text_value;
            if (varScore2 == 1) {
                varScore = 1;
                varScore2 = 0;
            }
            break;
    }

    createJSON(varScore, varScore2);

}


function nextQuestion(ev) {
    loop2 = loop2 + 1;
    if (boolCheck == 0) {
        checkAnswer();
    }

    if (totalQuestions == -1) {
        totalQuestions = jsonData.test[siteID].questions.length;
    }

    if (parseInt(answerID, 10) == (parseInt(totalQuestions, 10) - 1)) {
        //if ($("#questions").length == 1) {
        //        alert("Questions over");
        boolCheck = 1;
        $("#chapters li a#" + questionID).closest('li').remove();
        visitChap = 1;
        totalQuestions = -1;
        event.preventDefault();
        $(":mobile-pagecontainer").pagecontainer('change', '#chapters_page', {
            transition: "flip",
            reverse: true
        });
    } else {
        boolCheck = 0;
        answerID = parseInt(answerID, 10) + 1;
        ansKey = [];
        $("#answer2").html(jsonData.test[siteID].questions[answerID].question);
        $("#next_answers_page h1 #MyHeaderID").text("Question: #" + (parseInt(answerID, 10) + 1) + " of " + totalQuestions);
        $("#answers_next").empty();
        queFormat = jsonData.test[siteID].questions[answerID].questionFormat;

        // Get the correct answer of the selected question
        correctAns = jsonData.test[siteID].questions[answerID].answerId;
        contextGrp = jsonData.test[siteID].questions[answerID].contextGroup1;

        if (queFormat == 2 || queFormat == 3 || queFormat == 4 || queFormat == 5) {
            keyGrpLen = jsonData.test[siteID].questions[answerID].keys1.length;
            for (var j = 0; j < keyGrpLen; j++) {
                ansKey[j] = jsonData.test[siteID].questions[answerID].keys1[j];
            }
        }

        if (queFormat == 1 || queFormat == 2) {
            // Get the total answers for the selected question
            var totalAnswers = jsonData.test[siteID].questions[answerID].answers.length;
            for (var i = 0; i < totalAnswers; i++) {
                // Create a new list item containing each answers
                var answer2 = "<li data-icon='false'><a href='#next_answers_page' class='answer2' id='" + i + "' data-answer='" + correctAns + "' >" + jsonData.test[siteID].questions[answerID].answers[i] + "</a></li>";
                // Append each answer to the answers list

                $("#answers_next").append(answer2);
            }

            if (queFormat == 2) {
                contextGrp2 = jsonData.test[siteID].questions[answerID].contextGroup2;
                $("#answers_next").append('<br>');
                var label = document.createElement('label');
                subQuest = "Please enter the first 3 words of the sentence that shows your answer is correct.";
                label.textContent = "Please enter the first 3 words of the sentence that shows your answer is correct.";
                $("#answers_next").append(label);
                var input = document.createElement('input');
                input.type = "text";
                input.name = "sub3";
                $("#answers_next").append(input);
            }
        } else if (queFormat == 3 || queFormat == 5) {
            var input = document.createElement('input');
            input.name = "sub1";
            input.type = "text";
            $("#answers_next").append(input);
        } else if (queFormat == 4) {
            contextGrp2 = jsonData.test[siteID].questions[answerID].contextGroup2;
            var input = document.createElement('input');
            input.name = "sub1";
            input.type = "text";
            $("#answers_next").append(input);
            $("#answers_next").append('<br>');
            $("#answers_next").append('<br>');
            subQuest = jsonData.test[siteID].questions[answerID].subQuestion;
            $("#answers_next").append(subQuest);
            var key2GrpLen = jsonData.test[siteID].questions[answerID].keys2.length;
            for (var k = 0; k < key2GrpLen; k++) {
                ans2Key[k] = jsonData.test[siteID].questions[answerID].keys2[k];
            }
            var input1 = document.createElement('input');
            input1.name = "sub2";
            input1.type = "text";
            $("#answers_next").append(input1);
        }

        $("#answers_next li a.answer2").on('click', testClick);
        //    $('.showNxtPage').on('click', nextQuestion);
        $("#answers_next").listview().listview('refresh');
    }
}

function createJSON(varScore, varScore2) {
    item = {}
    var questionId = jsonData.test[siteID].questions[answerID].queId;
    item["contextGrp1"] = contextGrp;
    item["questionId"] = questionId;

    item["score1"] = varScore;
    if (queFormat == 1 || queFormat == 2) {
        var stuAnswer = jsonData.test[siteID].questions[answerID].answers[selectedAnswer];
        item["studentResponse1"] = stuAnswer;
    } else {
        item["studentResponse1"] = stuAns1;
    }

    if (queFormat == 2 || queFormat == 4) {
        item["contextGrp2"] = contextGrp2;
        item["score2"] = varScore2;
        item["studentResponse2"] = stuAns2;
    }
    jsonObj.push(item);
    jsonString = JSON.stringify(jsonObj)
    console.log(jsonString);
    storage.setItem("Student", jsonString);
}


function validateEmail() {
    email = $('input:text[name=email]').val();
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
    } else {
        $("#home1").css('color', 'red');
        $("#home1").html("Invalid email");
        event.preventDefault();
    }
   
}

//function calculateScores() {

//    for (var j = 0; j < jsonObj.length; j++) {
//        var score = "<li data-icon='false'>"+jsonObj[j]+"</li>";
//    }
//    $("#scores").append(score);

//}

