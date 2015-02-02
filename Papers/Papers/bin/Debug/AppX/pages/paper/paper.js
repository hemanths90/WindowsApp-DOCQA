// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var paperId;
    var questionId;
    WinJS.UI.Pages.define("/pages/paper/paper.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            if (!options) {
                $.get('http://www-scf.usc.edu/~darshanv/MapReduce.txt', function (data) {
                    $('#TextArea').html(data);
                });
            }
            $("#Display").text(options["PaperTitle"]);
            $.get(options["PaperLink"], function (data) {
                $('#TextArea').html(data);
            });
            paperId=options["PaperID"];
            WinJS.Utilities.query("#TextArea").listen("select",
                 selectEventHandler, false);
            WinJS.Utilities.query("#AskQuestion").listen("click",
          askQuestion, false);
            WinJS.Utilities.query("#confirmButton").listen("click",
          askQuestion, false);
            document.getElementById("confirmButton").addEventListener("click", confirmQuestion, false);

            requestAll({
                "requestType": 3,
                "PaperID": paperId
            }, displayQuestions, "");

        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
    function selectEventHandler(eventInfo) {
        eventInfo.preventDefault();
        var text = eventInfo.target;
        WinJS.Utilities.removeClass(document.getElementById("AskQuestion"), "Hidden");

    }

    function askQuestion(eventInfo) {
        eventInfo.preventDefault();
        var askButton = eventInfo.target;
        var text=WinJS.Utilities.query("#TextArea");
        var start = text[0].selectionStart;
        if (!start) {
            WinJS.Utilities.addClass(document.getElementById("AskQuestion"), "Hidden");

        }

        showFlyout(confirmFlyout, AskQuestion, "top");

       // WinJS.Utilities.removeClass(document.getElementById("AskQuestion"), "Hidden");

    }
    function showFlyout(flyout, anchor, placement) {
        flyout.winControl.show(anchor, placement);
    }
    function confirmQuestion() {
        var text=WinJS.Utilities.query("#TextArea");
        var start = text[0].selectionStart;

        var paperText;
        if (text[0].selectionEnd - text[0].selectionStart > 50) {
            paperText = text[0].value.substring(text[0].selectionStart, text[0].selectionStart+46)+"...";


        } else {
            paperText = text[0].value.substring(text[0].selectionStart, text[0].selectionEnd);
        }
        requestAll({
            "paperText": paperText,
            "requestType": 2,
            "paperID": paperId,
            "question": $("#question").val()
            }, questionNotification, "");

        document.getElementById("confirmFlyout").winControl.hide();
    }
    function questionNotification(msg) {
        return;
    }

    function submitText() {
        requestAll({
            "requestType": 4,
            "question_id": questionId,
            "comment_content": $("#textContent").val()
        }, submitTextNotification, "");
    }
    
    function submitTextNotification(msg) {
        return;
    }

    function displayQuestions(result) {
        var questions = [];
        var comments = [];
        var paperText = [];
        for (var i = 0; i < result.length; i++) {
            questions.push(result[i]["question_content"]);
            comments.push(result[i]["comment_content"]);
            paperText.push(result[i]["PaperText"]);
        }
        var oDiv = $("<div>");
        //Request for questions from DB
        var questHTML = "<ul>";
        for(var i=0; i<result.length; i++) {
            questHTML += "<li>"+paperText[i]+"</li>";

            questHTML += "<ol>";
            questHTML += "<li>"+questions[i]+"</li></ol>";
            questHTML += "<ul><li>"+comments[i]+"</li>";
            questHTML += "<li><textarea rows='4' cols='50' id='textContent'></textarea>"
                      + "<input type='submit' id='aSubmit' value='Submit' >"
                      + "</li></ul></ul>";
        }

        oDiv.html(questHTML);
        $("#Questions").append(oDiv);

        WinJS.Utilities.query("#aSubmit").listen("click",
         submitText, false);
       
    }

})();
