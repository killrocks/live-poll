$(document).ready(function() {
    let socket = io.connect(); // socket.io connection
    let currentId = '';
    socket.emit('create_poll');
    socket.on('poll_created', function(id){
        currentId = id;
        let url = 'http://localhost:8000/student/'+ id; 
        $('#url_container').append(`<input type='text' id='current_url' value='${url}'><button id='copy_url'>Copy URL</button><button id='reset'>Reset</button>`);
        //copy url button
        $('#copy_url').on('click', function (e) {
            e.preventDefault();
            $('#current_url').select();
            document.execCommand("copy");
        });
        //reset button
        $('#reset').on('click', function(e) {
            e.preventDefault();
            location.reload();
        });
        $('#current_url').html(url);
        $('#poll_id').val(currentId);
    });
    /* DOCU: Inserting an option by button click :: Owner: Cesar Francisco */
    $('#add_option').on('click', function(e) {
        e.preventDefault();
        $('ol#options').append(`<li><input type='text' name='options[]' placeholder='Type an option here...' id='option'><i id="delete-icon" class="fas fa-trash-alt"></i></li>`);
    });
    /* DOCU: This handles the insertion/updates of question and options by user input :: Owner: Cesar Francisco */
    $('#pollForm').on('keyup', function () {
        let question = $('#question').val();
        let opt = $('input[name="options[]"]');
        let optValues = [];
        for(let i = 0; i < opt.length; i++){
            if(opt[i].value != ''){
                optValues.push({option: opt[i].value, vote_count: 0});
            }
        }
        socket.emit('update_answer', {id: currentId, question: question, opt: optValues});
    });
    /* DOCU: This handles the dom manipulation of delete icon :: Owner: Cesar Francisco */
    $(document).on('mouseenter', '#options li', function(){
        $(this).find("#delete-icon").show();
        $(this).find("#delete-icon").css('color', 'red');
        $(this).find("#delete-icon").css('cursor', 'pointer');
        $(this).find("#delete-icon").remove('cursor', 'pointer');
    });
    $(document).on('mouseleave', '#options li', function(){
        $(this).find("#delete-icon").hide();
    });
    /* DOCU: This handles the removing/updating of each option :: Owner: Cesar Francisco */
    $(document).on('click', '#delete-icon', function(){
        $(this).parent(this).remove();
        let question = $('#question').val();
        let opt = $('input[name="options[]"]');
        let optValues = [];
        for(let i = 0; i < opt.length; i++){
            if(opt[i].value != ''){
                optValues.push({option: opt[i].value, vote_count: 0});
            }
        }
        socket.emit('update_answer', {id: currentId, question: question, opt: optValues});
    });
});
