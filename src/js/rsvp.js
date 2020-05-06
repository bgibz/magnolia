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
    for (i = 0; i < data.length; i++) {
        if (data[i].Response == 'Pending') {
            $("#formTitle").empty();
            $("#formTitle").text("Please RSVP By August 7th");
            let card = $("<div class='form-group rsvp'></div>");
            let id = $("<input class='_id' type='hidden' value='" + data[i]._oid + "'>");
            let name = $("<h4>" + data[i].Guest + "</h4>");
            let radioDiv = $("<div class='form-check form-check-inline'></div>");
            let radioDivTwo = $("<div class='form-check form-check-inline'></div>");
            let respY = $("<input type='radio' name='rsvp' id ='rsvpYes" + i + "'" + "value='Yes'>");
            let labelY = $("<label class='form-check-label' for='rsvpYes" + i + "'" + ">Accepts With Pleasure</label>");
            let respN = $("<input type='radio' name='rsvp' id ='rsvpNo" + i + "'" + "value='No'>");
            let labelN = $("<label class='form-check-label' for='rsvpNo" + i + "'" + ">Regretfully Declines</label>");
            radioDiv.append(respY, labelY);
            radioDivTwo.append(respN, labelN);
            card.append(id, name, radioDiv, radioDivTwo);
            $("#rsvpForm").append(card);
            $("#responseDiv").show();
        }
    }
}

$(document).ready(function() {
    $("#rsvpFindBtn").click(function(event) {
        event.preventDefault();
        getRSVP();
    });
});