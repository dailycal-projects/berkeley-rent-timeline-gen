var numQuestions = 5;
var numOptions = 4;

$(document).ready(function() {

    for (var numQuestion = 1; numQuestion <= numQuestions; numQuestion++) {
        var expId = "q" + numQuestion + "-exp";

        for (var numOption = 1; numOption <= numOptions; numOption++) {
            var buttonId = ("btn-" + "q" + numQuestion + "-" + numOption).slice(0);

            if ($("#" + buttonId).length) {

                if ($("#" + buttonId).hasClass('correct')) {

                    $("#" + buttonId).click({q: numQuestion}, function(data) {
                        var currId = data.target.id
                        var expIdCopy = "q" + data.data.q + "-exp";
                        var btnQ = "btn-q" + data.data.q;
                        if ($("#" + expIdCopy).css('display') == 'none') {
                            $("." + btnQ).each(function() {
                                $(this).find('*').addClass('answered');
                            });
                            $('#' + currId).addClass('correctAnswer')
                            $("#" + expIdCopy + "-correct").show();
                            $("#" + expIdCopy + "-wrong").hide();
                            $("#" + expIdCopy).show();
                            console.log("#" + expIdCopy + "-correct");
                        }
                    });

                } else {

                    $("#" + buttonId).click({q: numQuestion}, function(data) {
                        var currId = data.target.id
                        var expIdCopy = "q" + data.data.q + "-exp";
                        var btnQ = "btn-q" + data.data.q;
                        if ($("#" + expIdCopy).css('display') == 'none') {
                            $("." + btnQ).each(function() {
                                $(this).find('*').addClass('answered');
                            });
                            $("." + btnQ).find('.correct').addClass('correctAnswer');
                            $('#' + currId).addClass('wrongAnswer')
                            $("#" + expIdCopy + "-correct").hide();
                            $("#" + expIdCopy + "-wrong").show();
                            $("#" + expIdCopy).show();
                            console.log("#" + expIdCopy + "-wrong");
                        }
                    });
                }
            }
        }
    }
});