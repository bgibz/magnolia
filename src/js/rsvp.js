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
            url: "https://h4467dph4g.execute-api.us-west-2.amazonaws.com/develop/RSVP?guest_name="+guestName,
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
    for (i = 0; i < data.length; i++) {
        if (data[i].Response == 'Pending') {
            submissionChk = true;
            $("#formTitle").empty();
            $("#formTitle").text("Please RSVP By August 7th");
            renderRSVPFormCard(data[i], i);
            $("#responseDiv").show();
        } else{
            renderRSVPDetailCard(data [i], i);
            $("#responseDiv").show();
            $(".loader").show();
            
        }
    }
    if (submissionChk) {
        let submissionBtn = $('<div class="form-group"><button type="submit" id="rsvpSubmitBtn" class="btn btn-default">Submit</button></div>')
        $("#rsvpForm").append(submissionBtn);
        //TODO: Attach listener for RSVP submission
    }
}

function renderRSVPFormCard(data, i) {
    let card = $("<div class='form-group rsvp'></div>");
    let top = $("<div class='form-row guest text-left'><input class='_id' type='hidden' value='" + data._id + "'><h3>" + data.Guest + "</h3></div>");
    let underline = $("<div class='row'><div class='col-sm-4 col-xs-6 col marker'></div><div class='col-sm-7 col-xs-6'></div></div>")
    let radioRow = $("<div class='form-row rsvp-row' id='rsvpRadios'></div>");
    let radioDiv = $("<div class='form-check form-check-inline col-sm-6'></div>");
    let radioDivTwo = $("<div class='form-check form-check-inline col-sm-6'></div>");
    let respY = $("<input type='radio' class='form-check-input response' name='rsvp" + i + "' id ='rsvpYes" + i + "'" + "value='Attending'>");
    let labelY = $("<label class='form-check-label' for='rsvpYes" + i + "'" + "> Accepts With Pleasure</label>");
    let respN = $("<input type='radio' class='form-check-input response' name='rsvp" + i + "' id ='rsvpNo" + i + "'" + "value='Unable to Attend'>");
    let labelN = $("<label class='form-check-label' for='rsvpNo" + i + "'" + "> Regretfully Declines</label>");
    let dietDiv = $("<div class='form-check text-left'><h5>Let us know if you have any dietary restrictions<h5></div>");
    let noRestrictions = $("<div class='form-row'><input type='radio' class='form-check-input meal' name='noRs" + i + "' id='noRs" + i + "' + value='0'>" + "<label class='form-check-label' for='noRs" + i + "'" + "> No Restrictions</label></div>");
    let veg = $("<div class='form-row'><input type='radio' class='form-check-input meal' name='veg" + i + "' id='veg" + i + "' + value='2'>" + "<label class='form-check-label' for='veg" + i + "'" + ">Vegan/Vegetarian</label></div>");
    let celiac = $("<div class='form-row'><input type='radio' class='form-check-input meal' name='celiac" + i + "' id='celiac" + i + "' + value='2'>" + "<label class='form-check-label' for='celiac" + i + "'" + ">Gluten Free</label></div>");
    let nuts = $("<div class='form-row'><input type='radio' class='form-check-input meal' name='nuts" + i + "' id='nuts" + i + "' + value='2'>" + "<label class='form-check-label' for='nuts" + i + "'" + ">Nut Allergy</label></div>");
    let other = $("<div class='form-row'><input type='radio' class='form-check-input meal' name='other" + i + "' id='other" + i + "' + value='2'>" + "<label class='form-check-label' for='other" + i + "'" + ">Other (Please provide details in text box below)</label></div>");
    let textRow = $("<div class='form-row rsvp-row text-left'><p style='color:#891632'>Please use this space to let us know if you have any dietary restrictions. Or just leave us a message!</p></div>");
    let textArea = $("<textarea class='form-control' name='detailsTextArea" + i +  "' id='detailsTextArea" + i + "' rows='3'></textarea>")
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
    let card = $("<div class='form-group rsvp'></div>");
    let top = $("<div class='form-row guest text-left'><div class='_id' style='display:none;'>" + data._id + "</div><h3>" + data.Guest + "</h3></div>");
    let underline = $("<div class='row'><div class='col-sm-4 col marker'></div><div class='col-sm-7'></div></div>")
    let response = $("<div class='row submission'><h5>"+"Response: " + data.Response + "</h5></div>");
    let meal = $("<div class='row submission'><h5>"+"Dietary Restrictions: " + mealMap[data.Diet] + "</h5></div>");
    let details = $("<div class='row submission'><h5>Details:</h5><p>" + data.Details + "</p></div>");
    card.append(top, underline, response, meal, details);
    $("#responseDiv").append(card);
}

function buildRSVPResponse() {
    let form = $("#rsvpForm").find(".rsvp");
    let response = []
    for (i = 0; i < form.length; i++) {
        let curr = $(form[i]);
        let name = $(curr).find("h3").text();
        let _id = $(curr).find()("._id")[0].value;
        let response = $(curr).find("input.response:checked")[0].value;
        let meal = $(curr).find("input.meal:checked")[0].value;
        let details = $(curr).find("#detailsTextArea0")[0].value;
        let guestResponse = {
            "_id": _id,
            "name": name,
            "details": details,
            "meal": meal,
            "response": response
        }
        response.push(guestResponse);
    }
    postRSVPResponse(response);
}

function postRSVPResponse(response){
    let errorCheck = false
    if (response.length === 0) {
        // Error
        errorCheck = true;
    } else {
        for (i = 0; i < response.length; i++){
            // Check properties of each response
            if (response[i]._id < 0 || response[i].meal > 5 || !response[i].name || !response[i].response) {
                errorCheck = true;
            }
        }
    }
    let payload = {
        "guest_responses": response
    }
    // All good, hide form and send response
    $("#rsvpForm").hide();
    $(".loader").show();
    $.ajax({
        url: "https://h4467dph4g.execute-api.us-west-2.amazonaws.com/develop/RSVP",
        context: this,
        cache: false,
        method: "POST",
        dataType: "json",
        headers: {"Accept": "application/json; odata=verbose"},
        data: payload,
        success: function(data) {
            $('.loader').hide();
            // thanks for your response...
        },
        error: function(data) {
            $(".loader").hide();
            $("#rsvpForm").show();
            $("#submitError").empty();
            $("#submitError").append("<span class='text-danger'>Something went wrong. Please try again later.</span>")
        }
    })

}

$(document).ready(function() {
    $("#rsvpFindBtn").click(function(event) {
        event.preventDefault();
        getRSVP();
    });
});