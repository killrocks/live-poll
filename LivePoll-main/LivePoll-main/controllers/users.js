class Users {
    index(req, res){
        res.render('index');
    }
    create_poll(req, res){
        res.render('teachers/create_poll');
    }
    student_answer(req, res){
        res.render('students/student_view', {random_id: req.params.id});
    }
    teacher_results(req, res){
        res.render('teachers/results', {data: req.body});
    }
    student_results(req, res){
        res.render('students/results', {data: req.body});
    }
}
module.exports = new Users;