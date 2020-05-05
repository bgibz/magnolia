function getRSVP() {
    let guestName = $("#guest_name").val();
    if (!guestName) {
        $("#submitError").empty();
        $("#submitError").append("<span class='text-danger'>Oops! Looks like you forgot to fill in your name.</span>")
    }  else {
        guestName = guestName.trim();
        guestName = guestName.replace("+", " ");
        console.log("Guest: " + guestName);
        $.ajax({
            url: "https://h4467dph4g.execute-api.us-west-2.amazonaws.com/develop/RSVP?guest_name="+guestName,
            context: this,
            cache: false,
            method: "GET",
            dataType: "json",
            headers: {"Accept": "application/json; odata=verbose",
                    },
            success: function(data) {
                console.log("Data: " + data)
            },
            error: function(data) {
                console.log("Error: " + JSON.stringify(data))
                $("#submitError").empty();
        $("#submitError").append("<span class='text-danger'>Something went wrong. Please try again later.</span>")
            }
        })
    }
}

$(document).ready(function() {
    $("#rsvpFindBtn").click(function(event) {
        event.preventDefault();
        getRSVP();
    });
});