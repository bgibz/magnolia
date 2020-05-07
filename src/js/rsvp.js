function getRSVP() {
    let guestName = $("#guest_name").val();
    if (!guestName) {
        $("#submitError").empty();
        $("#submitError").append("<span class='text-danger'>Oops! Looks like you forgot to fill in your name.</span>")
    }  else {
        guestName = guestName.trim();
        guestName = guestName.replace("+", " ");
        console.log("Guest: " + guestName);
        //TODO: Display loading gif??
        $.ajax({
            url: "https://h4467dph4g.execute-api.us-west-2.amazonaws.com/develop/RSVP?guest_name="+guestName,
            context: this,
            cache: false,
            method: "GET",
            dataType: "json",
            headers: {"Accept": "application/json; odata=verbose"},
            success: function(data) {
                $('#nameCheck').hide();
                displayRSVP(data.result);
            },
            error: function(data) {
                console.log("Error: " + JSON.stringify(data))
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
            // TODO: Display RSVP status
        }
    }
    if (submissionChk) {
        let submissionBtn = $('<div class="form-group"><button type="submit" id="rsvpSubmitBtn" class="btn btn-default">Submit</button></div>')
        $("#rsvpForm").append(submissionBtn);
        //TODO
    }
}

function renderRSVPFormCard(data, i) {
    $("#formTitle").empty();
    $("#formTitle").text("Please RSVP By August 7th");
    let card = $("<div class='form-group rsvp'></div>");
    let top = $("<div class='form-row guest text-left'><input class='_id' type='hidden' value='" + data._id + "'><h3>" + data.Guest + "</h3></div>");
    let underline = $("<div class='row'><div class='col-sm-4 col marker'></div><div class='col-sm-7'></div></div>")
    let radioRow = $("<div class='form-row rsvp-row'></div>");
    let radioDiv = $("<div class='form-check form-check-inline col-sm-6'></div>");
    let radioDivTwo = $("<div class='form-check form-check-inline col-sm-6'></div>");
    let respY = $("<input type='radio' class='form-check-input' name='rsvp" + i + "' id ='rsvpYes" + i + "'" + "value='Yes''>");
    let labelY = $("<label class='form-check-label' for='rsvpYes" + i + "'" + "> Accepts With Pleasure</label>");
    let respN = $("<input type='radio' class='form-check-input' name='rsvp" + i + "' id ='rsvpNo" + i + "'" + "value='No'>");
    let labelN = $("<label class='form-check-label' for='rsvpNo" + i + "'" + "> Regretfully Declines</label>");
    let textRow = $("<div class='form-row rsvp-row text-left'><p style='color:#891632'>Please use this space to let us know if you have any dietary restrictions. Or just leave us a message!</p></div>");
    let textArea = $("<textarea class='form-control' name='detailsTextArea" + i +  "' id='detailsTextArea" + i + "' rows='3'></textarea>")
    radioDiv.append(respY, labelY);
    radioDivTwo.append(respN, labelN);
    radioRow.append(radioDiv, radioDivTwo);
    textRow.append(textArea);
    card.append(top, underline, radioRow, textRow);
    $("#rsvpForm").append(card);
}

$(document).ready(function() {
    $("#rsvpFindBtn").click(function(event) {
        event.preventDefault();
        getRSVP();
    });
});