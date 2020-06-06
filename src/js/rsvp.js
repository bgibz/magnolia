var globalGuestUpdates = [];

function getRSVP() {
    let guestName = $("#guest_name").val();
    if (!guestName) {
        $("#submitError").empty();
        $("#submitError").append("<span class='text-danger'>Oops! Looks like you forgot to fill in your name.</span>")
    }  else {
        guestName = guestName.trim();
        guestName = guestName.replace("+", " ");
        $("#nameCheck").hide();
        $(".loader").show();
        $.ajax({
            url: "https://h4467dph4g.execute-api.us-west-2.amazonaws.com/develop/Guest?guest_name="+guestName,
            context: this,
            cache: false,
            method: "GET",
            dataType: "json",
            headers: {"Accept": "application/json; odata=verbose"},
            success: function(data) {
                $('.loader').hide();
                displayRSVP(data.result);
            },
            error: function(data) {
                $(".loader").hide();
                $("#nameCheck").show();
                $("#submitError").empty();
                $("#submitError").append("<span class='text-danger'>Something went wrong. Please try again later.</span>")
            }
        })
    }
}

function displayRSVP(data) {
    var i;
    let submissionChk = false;
    let renderUpdateBtn = false;
    for (i = 0; i < data.length; i++) {
        if (data[i].Response == 'Pending') {
            submissionChk = true;
            globalGuestUpdates.push(data[i]);
            $("#formTitle").empty();
            $("#formTitle").text("Please RSVP By August 7th");
            renderRSVPFormCard(data[i], i);
            $("#responseDiv").show();
        } else{
            renderUpdateBtn = true;
            globalGuestUpdates.push(data[i])
            renderRSVPDetailCard(data[i], i);
            $("#responseDiv").show();
            $(".loader").show();
        }
    }
    if (submissionChk) {
        let submissionBtn = $('<div class="form-group"><button type="submit" id="rsvpSubmitBtn" class="btn btn-default">Submit</button></div>')
        $("#rsvpForm").append(submissionBtn);
        $(submissionBtn).click(function(event) {
            event.preventDefault();
            buildRSVPResponse();
        })
    }
    if (renderUpdateBtn) {
        appendUpdateResponseBtn();
    }
}

function renderRSVPFormCard(data, i) {
    let card = $("<div class='form-group rsvp'></div>");
    let top = $("<div class='form-row guest text-left'><input class='_id' type='hidden' value='" + data._id + "'><h3 class='guest-name'>" + data.Guest + "</h3></div>");
    let underline = $("<div class='row'><div class='col-sm-4 col-xs-6 col marker'></div><div class='col-sm-7 col-xs-6'></div></div>")
    let radioRow = $("<div class='form-row rsvp-row' id='rsvpRadios'></div>");
    let radioDiv = $("<div class='form-check form-check-inline col-sm-6'></div>");
    let radioDivTwo = $("<div class='form-check form-check-inline col-sm-6'></div>");
    let respY = $("<input type='radio' class='form-check-input response' name='rsvp" + i + "' id ='rsvpYes" + i + "'" + "value='Attending'>");
    let labelY = $("<label class='form-check-label' for='rsvpYes" + i + "'" + "> Accepts With Pleasure</label>");
    let respN = $("<input type='radio' class='form-check-input response' name='rsvp" + i + "' id ='rsvpNo" + i + "'" + "value='Unable to Attend'>");
    let labelN = $("<label class='form-check-label' for='rsvpNo" + i + "'" + "> Regretfully Declines</label>");
    let dietDiv = $("<div class='form-check text-left'><h5>Let us know if you have any dietary restrictions<h5></div>");
    let noRestrictions = $("<div class='form-row'><input type='radio' class='form-check-input meal' name='meal" + i + "' id='noRs" + i + "' + value='0'>" + "<label class='form-check-label' for='noRs" + i + "'" + "> No Restrictions</label></div>");
    let veg = $("<div class='form-row'><input type='radio' class='form-check-input meal' name='meal" + i + "' id='veg" + i + "' + value='2'>" + "<label class='form-check-label' for='veg" + i + "'" + ">Vegan/Vegetarian</label></div>");
    let celiac = $("<div class='form-row'><input type='radio' class='form-check-input meal' name='meal" + i + "' id='celiac" + i + "' + value='3'>" + "<label class='form-check-label' for='celiac" + i + "'" + ">Gluten Free</label></div>");
    let nuts = $("<div class='form-row'><input type='radio' class='form-check-input meal' name='meal" + i + "' id='nuts" + i + "' + value='4'>" + "<label class='form-check-label' for='nuts" + i + "'" + ">Nut Allergy</label></div>");
    let other = $("<div class='form-row'><input type='radio' class='form-check-input meal' name='meal" + i + "' id='other" + i + "' + value='5'>" + "<label class='form-check-label' for='other" + i + "'" + ">Other (Please provide details in text box below)</label></div>");
    let textRow = $("<div class='form-row rsvp-row text-left'><p style='color:#891632'>Please use this space to let us know if you have any dietary restrictions. Or just leave us a message!</p></div>");
    let textArea = $("<textarea class='form-control detailsTextArea' name='detailsTextArea" + i +  "' id='detailsTextArea" + i + "' rows='3'></textarea>")
    radioDiv.append(respY, labelY);
    radioDivTwo.append(respN, labelN);
    radioRow.append(radioDiv, radioDivTwo);
    dietDiv.append(noRestrictions, veg, celiac, nuts, other);
    textRow.append(textArea);
    card.append(top, underline, radioRow, dietDiv, textRow);
    $("#rsvpForm").append(card);
}

function renderRSVPDetailCard(data, i) {
    const mealMap = ["None", "Vegan/Vegetarian", "Gluten Free", "Nut Allergy", "Other (In notes)"];
    let card = $("<div class='form-group rsvp rsvp_submitted text-left'></div>");
    let top = $("<div class='form-row guest'><div class='_id' style='display:none;'>" + data._id + "</div><h3 class='guest-name'>" + data.Guest + "</h3></div>");
    let underline = $("<div class='row'><div class='col-sm-4 col marker'></div><div class='col-sm-7'></div></div>")
    let response = $("<div class='row submission'><h4>"+"Response: " + data.Response + "</h4></div>");
    let meal = $("<div class='row submission'><h5>"+"Dietary Restrictions:</h5><p> " + mealMap[data.Diet] + "</p></div>");
    let details = $("<div class='row submission'><h5>Details:</h5><p>" + data.Details + "</p></div>");
    card.append(top, underline, response, meal, details);
    $("#responseDiv").append(card);
}

function renderResponseConfirmation(data) {
    let mealMap = ["No Restrictions", "Vegan/Vegetarian", "Celiac", "Nut Allergy", "Other"];
    let target = $("<div class='rsvp text-left></div>");
    let name = $("<h3 class='guest-name'>" + data.name + "</h3>");
    let underline = $("<div class='row'><div class='col-sm-4 col marker'></div><div class='col-sm-7'></div></div>");
    let response = $("<div class='row' style='padding-left: 15px;'><p><strong>Response: </strong>" + data.response + "</p></div>");
    let meal_choice = $("<div class='row' style='padding-left: 15px;'><p><strong>Meal Choice: </strong>" + mealMap[data.meal] + "</p></div>");  
    target.append(name, underline, response, meal_choice);  
}

function buildRSVPResponse() {
    let form = $("#rsvpForm").find(".rsvp");
    let responses = []
    for (i = 0; i < form.length; i++) {
        let curr = $(form[i]);
        let name = $(curr).find("h3").text();
        let _id = $(curr).find("._id")[0].value;
        let response = $(curr).find("input.response:checked")[0].value;
        let meal = $(curr).find("input.meal:checked")[0].value;
        let details = $(curr).find(".detailsTextArea")[0].value;
        let guestResponse = {
            "_id": _id,
            "Guest": name,
            "details": details,
            "meal": meal,
            "response": response
        }
        responses.push(guestResponse);
    }
    postRSVPResponse(responses);
}

function appendUpdateResponseBtn(){
    $(".loader").show();
    let btn = $("<div class='col-sm-3 cok-sm--offset-2 text-right'><button type='submit' id='updateResponse' class='btn btn-default'>Update Response</button></div>")
    $("#updateBtn").append(btn);
    $("#updateBtn").show();
    $(btn).click(function event(){
        $("#updateBtn").hide();
        $("#formTitle").empty();
        $("#formTitle").text("Please RSVP By August 7th");
        $("#rsvpForm").empty();
        $(".rsvp_submitted").empty();
        $(".rsvp_submitted").hide();
        for (i = 0; i < globalGuestUpdates.length; i++){
            renderRSVPFormCard(globalGuestUpdates[i], i);
        }
        let submissionBtn = $('<div class="form-group"><button type="submit" id="rsvpSubmitBtn" class="btn btn-default">Submit</button></div>')
        $("#rsvpForm").append(submissionBtn);
        $("#responseDiv").show();
        $(".loader").hide();
        $(submissionBtn).click(function(event) {
            event.preventDefault();
            buildRSVPResponse();
        })
    });
}

function postRSVPResponse(response){
    let errorCheck = false
    if (response.length === 0) {
        // Error
        errorCheck = true;
    } else {
        for (i = 0; i < response.length; i++){
            // Check properties of each response
            if (response[i]._id < 0 || !response[i].meal || response[i].meal > 5 || !response[i].name || !response[i].response) {
                errorCheck = true;
            }
        }
    }
    let payload = {
        "guest_responses": response
    }
    // Hide form and send response
    $("#rsvpForm").hide();
    $(".loader").show();
    $.ajax({
        url: "https://h4467dph4g.execute-api.us-west-2.amazonaws.com/develop/RSVP",
        context: this,
        cache: false,
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        headers: {"Accept": "application/json; odata=verbose"},
        data: JSON.stringify(payload),
        success: function(data) {
            $('.loader').hide();
            $("#responseDiv").empty();
            if (data.length === 1) {
                $("#formTitle").text("Thank You For Your Response");
                globalGuestUpdates = data;
                renderResponseConfirmation(data[0]);
                appendUpdateResponseBtn();
            }
            else if (data.length > 1) {
                $("#formTitle").text("Thank You For Your Responses");
                for ( i = 0; i < data.length; i++) {
                    globalGuestUpdates = data;
                    renderResponseConfirmation(data[i])
                    appendUpdateResponseBtn();
                }
            }
            else {
                $("#formTitle").text("We're sorry, something has gone wrong. Please try again later.");
            }
        },
        error: function(data) {
            $(".loader").hide();
            $("#rsvpForm").show();
            $("#submitError").empty();
            $("#submitError").append("<span class='text-danger'>Something went wrong. Please try again later.</span>")
            $("#submitError").show();
        }
    })

}

$(document).ready(function() {
    $("#rsvpFindBtn").click(function(event) {
        event.preventDefault();
        getRSVP();
    });
});