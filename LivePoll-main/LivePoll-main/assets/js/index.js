$(document).ready(function(){
    let name = prompt('Are you a teacher or a student?'); // user prompt if teacher or a student
    if(name == 'Teacher' || name == 'teacher'){
        name = 'teacher';
        $('.container').show();
    } else if(name == 'Student' || name == 'student') {
        name = 'student';
        let url = prompt('Please enter a valid url: ');
        url = url.slice(0,3) + url.slice(3);
        location.href = `${url}`;
    } else {
        alert('Please try again.')
        location.reload();
    }
});