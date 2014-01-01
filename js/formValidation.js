//This script handles the (1) focus out event of any field (2) submit button clicked event
//it validates all inputs. if all is fine then globalStatus=true and submit button event returns true.

$(document).ready(function () {
    var globalStatus = true;
    var prefixPhoneIsOk = false;
    var phnoneIsOk = false

    //full name focus out
    $("#Name_helper").focusout(function () {
        validateName();
    })

    //phone key down -  allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY home, end, period, and numpad decimal
    $("#Phone_helper").keydown(function (e) {
        var keysAllowed = [8, 9, 46, 110, 190, 35, 36, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
        var key = e.charCode || e.keyCode || 0;
        if ($.inArray(key, keysAllowed) == -1) {
            return false;
        }

        showMessage("#validationMessage2", "");
        showImage("#validationImage2", null, true);

        var prefixTwoDigits = ["02", "03", "04", "08", "09"];
        var prefixThreeDigits = ["050", "052", "053", "054", "055", "057", "058", "072", "073", "074", "075", "076", "077", "078", "079"];
        var currentVal = $("#Phone_helper").val();

        // alert(key);
        //add the first "-" after the prefix
        if (key != 8 && ($.inArray(currentVal, prefixTwoDigits) > -1 || $.inArray(currentVal, prefixThreeDigits) > -1) && currentVal.indexOf("-") == -1) {
            $("#Phone_helper").val(currentVal + "-");
        }
        //add the second "-" after the next 3 digist
        if (key != 8 && currentVal.indexOf("-") > -1 && currentVal.substr(currentVal.indexOf("-") + 1).length == 3) {
            $("#Phone_helper").val(currentVal + "-");
        }

        currentVal = $("#Phone_helper").val();


        //START check the prefix
        if (currentVal.indexOf("-") == -1) { //no prefix was detected yet by the system
            if (
                (currentVal.length == 0 && key != 48 && key != 96)
                ||
                (currentVal.length > 0 && currentVal.substr(0, 1) != "0")
                ||
                (currentVal.length == 1 && key != 50 && key != 51 && key != 52 && key != 53 && key != 55 && key != 56 && key != 57
                                        && key != 98 && key != 99 && key != 100 && key != 101 && key != 103 && key != 104 && key != 105)
                ||
                (currentVal.length == 2 && currentVal == "05" && key != 48 && key != 50 && key != 51 && key != 52 && key != 53 && key != 55 && key != 56
                                                              && key != 96 && key != 98 && key != 99 && key != 100 && key != 101 && key != 103 && key != 104)
                ||
                (currentVal.length == 2 && currentVal == "07" && key != 50 && key != 51 && key != 52 && key != 53 && key != 54 && key != 55 && key != 56 && key != 57
                                                              && key != 98 && key != 99 && key != 100 && key != 101 && key != 102 && key != 103 && key != 104 && key != 105)
                ||
                (currentVal.length > 1 && currentVal.substr(0, 2) != "05" && currentVal.substr(0, 2) != "07")
                ||
                (currentVal.length > 2)
                ) {
                showMessage("#validationMessage2", "נא להזין קידומת טלפון תקינה")
                showImage("#validationImage2", true)
                globalStatus = false;
                return;
            }
        }
        //END check the prefix




        //START check the phone
        if (currentVal.indexOf("-") > -1) { //atleast one prefix was found
            var phonePrefix = currentVal.substr(0, currentVal.indexOf("-"));
            //alert(phonePrefix);

            // alert(currentVal.substr(currentVal.indexOf("-")+1, 1));

            //when phone prefix includes two digits check that the number doesn't start with 0 1 2 3 4
            if (
                 (phonePrefix.length == 2 && currentVal.length == 3 && (key == 48 || key == 49 || key == 50 || key == 51 || key == 52 || key == 96 || key == 97 || key == 98 || key == 99 || key == 100))
                ||
                 (phonePrefix.length == 2 && currentVal.length > 3
                   &&
                      (currentVal.substr(currentVal.indexOf("-") + 1, 1) == "0"
                       || currentVal.substr(currentVal.indexOf("-") + 1, 1) == "1"
                       || currentVal.substr(currentVal.indexOf("-") + 1, 1) == "2"
                       || currentVal.substr(currentVal.indexOf("-") + 1, 1) == "3"
                       || currentVal.substr(currentVal.indexOf("-") + 1, 1) == "4")
                      )
                ) {
                showMessage("#validationMessage2", "מספר הטלפון לא תקין")
                showImage("#validationImage2", true)
                globalStatus = false;
                return;
            }


            //when phone prefix includes three digits check that the number doesn't start with 0 1
            if (
               (phonePrefix.length == 3 && currentVal.length == 4 && (key == 48 || key == 49 || key == 96 || key == 97))
              ||
               (phonePrefix.length == 3 && currentVal.length > 4
                 &&
                    (currentVal.substr(currentVal.indexOf("-") + 1, 1) == "0"
                     || currentVal.substr(currentVal.indexOf("-") + 1, 1) == "1")
                    )
              ) {
                showMessage("#validationMessage2", "מספר הטלפון לא תקין")
                showImage("#validationImage2", true)
                globalStatus = false;
                return;
            }


            //when phone prefix includes two digits check that total length 
            if (phonePrefix.length == 2 && currentVal.length > 10 && ((key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                showMessage("#validationMessage2", "מספר הטלפון ארוך מדי")
                showImage("#validationImage2", true)
                globalStatus = false;
                return;
            }



            var phone = currentVal.substr(currentVal.indexOf("-") + 1).replace("-", "");
            //check the phone for 6+ occurance (in sequence) of the same digit
            for (var i = 0; i <= 9; i++) { //select digit by digit thru all the digits
                var count = 0;
                var ezer = 0;
                var s_i = i.toString();

                for (var t = 0; t <= phone.length - 1; t++) { // check for same digit in sequence
                    if ((phone.substr(t, 1) == s_i && t == 0) || (phone.substr(t, 1) == s_i && t - ezer == 1)) {
                        count += 1;
                        ezer = t;
                    }
                }

                if (count >= 5) {
                    showMessage("#validationMessage2", "מספר הטלפון לא תקין")
                    showImage("#validationImage2", true)
                    globalStatus = false;
                    return;
                }
            }

            var count = currentVal.match(/-/g);
            if (count.length == 2) {
                //if prefix is two digits place the v
                if (phonePrefix.length == 2 && currentVal.length >= 10 && ((key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                    showImage("#validationImage2", false)
                    globalStatus = false;
                    return;
                }
                //if prefix is three digits place the v
                if (phonePrefix.length == 3 && currentVal.length >= 11 && ((key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                    showImage("#validationImage2", false)
                    globalStatus = false;
                    return;
                }
            }
        }
        //END check the phone





        return true;
    });

    //phone focus out
    $("#Phone_helper").focusout(function () {
        validatePhone();
    })

    //procedure type focus out
    $("#Procedure_Type").focusout(function () {
        validateProcedureType();
    })

    //procedure change
    $("#Procedure_Type").change(function () {
        validateProcedureType();
    })

    //region focus out
    $("#Region").focusout(function () {
        validateRegion();
    })

    //region change
    $("#Region").change(function () {
        validateRegion();
    })

    //button submit form clicked
    $("#submit").click(function () {
        globalStatus = true;

        validateName();
        validatePhone();
        validateProcedureType();
        validateRegion();

        //if all is fine take out the both helper fields of name + phone that will not be posted
        if (globalStatus) {
            $("#Name_helper").remove();
            $("#Phone_helper").remove();
        }
        return globalStatus;
    })

    //validate the First (and Last) name
    function validateName() {

        $("#First_Name").val("");
        $("#Last_Name").val("");

        $("#validationMessage1").html("");
        $("#validationImage1").html("");
        var fullName = $("#Name_helper").val();
        var isNumberInFullname = fullName.match(/\d+/g);
        if (fullName.length < 2 || isNumberInFullname != null) {
            var message = "נא להזין שם מלא ";
            if (isNumberInFullname != null) { message = message + "וחוקי"; }
            showMessage("#validationMessage1", message)
            showImage("#validationImage1", true)
            globalStatus = false;
            return;
        }
        else {
            var lastName = "";
            var firstName = fullName;

            //check if last name was entered
            if (fullName.indexOf(" ") > -1) {
                lastName = fullName.substr(fullName.indexOf(" "), fullName.length).replace(" ", "");
                firstName = fullName.replace(lastName, "").replace(" ", "");

                // check that first and last name are not one character
                if (lastName.length == 1 || firstName.length == 1) {
                    var message = "נא להזין שם חוקי";
                    showMessage("#validationMessage1", message)
                    showImage("#validationImage1", true)
                    globalStatus = false;
                    return;
                }
            }
            // check that any charcter does not appears 3 times in arrow
            // start with the last name
            var count = 0;
            var ezer = 0;
            if (firstName.length >= 3) {
                for (var i = 0; i < firstName.length - 1; i++) {
                    count = 0;
                    ezer = 0;
                    for (var t = 0; t < (firstName.length); t++) {
                        if (firstName.substr(i, 1) == firstName.substr(t, 1) && (ezer == 0 || ezer - t == -1)) {
                            count += 1;
                            ezer = t;
                            if (count >= 3) {
                                var message = "נא להזין שם חוקי";
                                showMessage("#validationMessage1", message)
                                showImage("#validationImage1", true)
                                globalStatus = false;
                                return;
                            }
                        }
                    }
                }
            }
            // and with the last name
            if (lastName.length >= 3) {
                for (var i = 0; i < lastName.length - 1; i++) {
                    count = 0;
                    ezer = 0;
                    for (var t = 0; t < (lastName.length); t++) {
                        if (lastName.substr(i, 1) == lastName.substr(t, 1) && (ezer == 0 || ezer - t == -1)) {
                            count += 1;
                            ezer = t;
                            if (count >= 3) {
                                var message = "נא להזין שם חוקי";
                                showMessage("#validationMessage1", message)
                                showImage("#validationImage1", true)
                                globalStatus = false;
                                return;
                            }
                        }
                    }
                }
            }
            $("#First_Name").val(firstName);
            $("#Last_Name").val(lastName);
        }
        showImage("#validationImage1", false);
    }

    //validate the phone
    function validatePhone() {
        $("#validationMessage2").html("");
        $("#validationImage2").html("&nbsp;");

        var currentVal = $("#Phone_helper").val();

        //first check that there are TWO "-" in the phone field = (that means user inserted correct phone prefix)
        var showError = false;

        try {
            var count = currentVal.match(/-/g);
            if (count.length != 2) {
                showError = true;
            }
        }
        catch (err) {
            showError = true;
        }

        if (showError) {
            showMessage("#validationMessage2", "יש למלא טלפון תקין")
            showImage("#validationImage2", true)
            globalStatus = false;
            return;
        }


        var phonePrefix = currentVal.substr(0, currentVal.indexOf("-"));

        //when phone prefix includes two digits check that total length is 11
        if (phonePrefix.length == 2 && currentVal.length > 11) {
            showMessage("#validationMessage2", "מספר הטלפון ארוך מדי")
            showImage("#validationImage2", true)
            globalStatus = false;
            return;
        }
        if (phonePrefix.length == 2 && currentVal.length < 11) {
            showMessage("#validationMessage2", "מספר הטלפון קצר מדי")
            showImage("#validationImage2", true)
            globalStatus = false;
            return;
        }

        //when phone prefix includes three digits check that total length is 12
        if (phonePrefix.length == 3 && currentVal.length > 12) {
            showMessage("#validationMessage2", "מספר הטלפון ארוך מדי")
            showImage("#validationImage2", true)
            globalStatus = false;
            return;
        }
        if (phonePrefix.length == 3 && currentVal.length < 12) {
            showMessage("#validationMessage2", "מספר הטלפון קצר מדי")
            showImage("#validationImage2", true)
            globalStatus = false;
            return;
        }


        //get the phone value (after the prefix)
        var phone = currentVal.substr(currentVal.indexOf("-")).replace(/-/g, "");

        //when phone prefix includes two digits check that the number doesn't start with 0 1 2 3 4
        if (phonePrefix.length == 2 && (phone.substr(0, 1) == "0" || phone.substr(0, 1) == "1" || phone.substr(0, 1) == "2" || phone.substr(0, 1) == "3" || phone.substr(0, 1) == "4")) {
            showMessage("#validationMessage2", "יש למלא טלפון תקין")
            showImage("#validationImage2", true)
            globalStatus = false;
            return;
        }

        //when phone prefix includes three digits check that the number doesn't start with 0 1
        if (phonePrefix.length == 3 && (phone.substr(0, 1) == "0" || phone.substr(0, 1) == "1")) {
            showMessage("#validationMessage2", "יש למלא טלפון תקין")
            showImage("#validationImage2", true)
            globalStatus = false;
            return;
        }

        //check the phone for 6+ occurance (in sequence = one after one) of the same digit
        for (var i = 0; i <= 9; i++) { //select digit by digit thru all the digits
            var count = 0;
            var ezer = 0;
            var s_i = i.toString();

            for (var t = 0; t <= phone.length - 1; t++) { // check for same digit in sequence
                if ((phone.substr(t, 1) == s_i && t == 0) || (phone.substr(t, 1) == s_i && t - ezer == 1)) {
                    count += 1;
                    ezer = t;
                }
            }

            if (count >= 6) {
                showMessage("#validationMessage2", "יש למלא טלפון תקין")
                showImage("#validationImage2", true)
                globalStatus = false;
                return;
            }

        }

        //if all validation above past show V ok sign
        showImage("#validationImage2", false)

        //set the true phone prefix and true phone number to be submitted
        $("#Phone_Prefix").val(phonePrefix);
        $("#Phone").val(phone);
    }

    //validate the procedure type
    function validateProcedureType() {
        $("#validationMessage3").html("");
        $("#validationImage3").html("&nbsp;");
        var Procedure_Type = $("#Procedure_Type").val();
        if (parseInt(Procedure_Type, 10) == -1) {
            showMessage("#validationMessage3", "נא לבחור סוג טיפול")
            showImage("#validationImage3", true)
            globalStatus = false;
        }
        else {
            showImage("#validationImage3", false)

        }
    }

    //validate the region
    function validateRegion() {
        $("#validationMessage4").html("");
        $("#validationImage4").html("&nbsp;");
        var Region = $("#Region").val();
        if (parseInt(Region, 10) == -1) {
            showMessage("#validationMessage4", "נא לבחור אזור")
            showImage("#validationImage4", true)
            globalStatus = false;
        }
        else {
            showImage("#validationImage4", false)

        }
    }

    //show the error message for the appropriate element
    function showMessage(elemetId, message) {
        $(elemetId).html(message);
    }

    //show either the v image or x image (for good or bad input)
    function showImage(elemetId, isX, isClear) {
        try {
            if (isClear) {
                $(elemetId).html("&nbsp;");
                return;
            }
        }
        catch (err) {
        }


        if (isX) {
            $(elemetId).html("<img src='images/x.png'/>");
        }
        else {
            $(elemetId).html("<img src='images/v.png'/>");
        }
    }
});