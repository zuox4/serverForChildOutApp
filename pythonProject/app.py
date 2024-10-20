import string

from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_bcrypt import Bcrypt
import random
import pars
import pars_mentors
from pars import get_unit_id
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_cors import CORS
from flask import request
from flask import jsonify
from flask_wtf import FlaskForm
from wtforms import PasswordField, SubmitField
from wtforms.validators import DataRequired, EqualTo
from flask_socketio import SocketIO
from flask import send_from_directory

from flask import render_template, redirect, url_for, session
app = Flask(__name__, static_folder='build/static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///school.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Задайте свой секретный ключ для JWT
app.config['SECRET_KEY'] = 'sdsdfsd'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)


class HistoryOut(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mentor_id = db.Column(db.Integer, db.ForeignKey('mentor.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    datetime_out = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    datetime_fix = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    mentor = db.relationship("Mentor", backref="history_outs")
    student = db.relationship("Student", backref="history_outs")
    leaving_notice = db.Column(db.Boolean, default=False, nullable=False)

    def __repr__(self):
        return f"<HistoryOut(mentor_id={self.mentor_id}, student_id={self.student_id}, datetime_out={self.datetime_out} datetime_fix={self.datetime_fix})>"

    @staticmethod
    def get_all_outs():
        outs = HistoryOut.query.all()
        x = [{'id': i.id, 'className': Student.get_classname(i.student.class_id),
              'mentor_name': i.mentor.name, 'student_name': i.student.short_name,
              'student_phone': i.student.phone_number, 'mentor_phone': i.mentor.phone_number,
              'data_time_out': i.datetime_out, 'data_time_fix': i.datetime_fix, 'leaving_notice': i.leaving_notice} for
             i in outs]
        print(x)
        return x



class ChangePasswordForm(FlaskForm):
    old_password = PasswordField('Старый пароль', validators=[DataRequired()])
    new_password = PasswordField('Новый пароль', validators=[DataRequired()])
    confirm_password = PasswordField('Подтверждение пароля', validators=[DataRequired(), EqualTo('new_password')])
    submit = SubmitField('Изменить пароль')


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(128))
    mentor_id = db.Column(db.String(8))

    @staticmethod
    def add_user(email, password, mentor_id):
        new_user = User(email=email, password=password, mentor_id=mentor_id)
        db.session.add(new_user)
        db.session.commit()


class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    students = db.relationship('Student', backref='class', lazy=True)
    mentor = db.relationship('Mentor', backref='class', lazy=True,
                             uselist=False)  # Один класс может иметь одного наставника

    def __repr__(self):
        return f'{self.name}'


class ClassCustom(ModelView):
    column_list = ('id', 'name', 'mentor', 'students')


# Модель Student
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    short_name = db.Column(db.String(100), nullable=False)
    birth_date = db.Column(db.Date, nullable=True)
    phone_number = db.Column(db.String(15), nullable=True)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'))

    def __repr__(self):
        return f'{self.short_name}'

    @staticmethod
    def get_classname(class_id):
        class_name = Class.query.filter_by(id=class_id).first()
        return class_name.name


class StudentCustom(ModelView):
    form_columns = ('short_name', 'birth_date', 'phone_number', 'class')


class Mentor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))  # Поле для хранения хэшированного пароля
    phone_number = db.Column(db.String(15), nullable=True)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=True)

    def __repr__(self):
        return f'{self.name}'

    def set_password(self, password):
        """Хэширует пароль и сохраняет хэш."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Проверяет правильность пароля."""
        return check_password_hash(self.password_hash, password)

    def change_password(self, old_password, new_password):
        """Меняет пароль, если старый пароль правильный."""
        if self.check_password(old_password):
            self.set_password(new_password)
            db.session.commit()  # Сохраняем изменения в базе данных
            return True
        else:
            return False

    @staticmethod
    def authenticate(email, password):
        """Авторизация по электронной почте и паролю."""
        mentor = Mentor.query.filter_by(email=email).first()

        if mentor and mentor.check_password(password):
            # Генерация JWT токена
            access_token = create_access_token(identity=mentor.id)
            return {
                'access_token': access_token,
                'id': mentor.id
            }
        else:
            return None

    @staticmethod
    def register(username, password, email, phone_number, class_id=None):
        """Регистрация нового наставника."""
        mentor = Mentor(name=username, email=email, phone_number=phone_number, class_id=class_id)
        mentor.set_password(password)
        db.session.add(mentor)
        db.session.commit()
        return mentor

    @staticmethod
    @jwt_required()
    def get_current_mentor():
        """Получение текущего наставника на основе JWT токена."""
        current_user_id = get_jwt_identity()
        return Mentor.query.get(current_user_id)


@socketio.on('connect')
def handle_connect():
    print('a user connected')


# Получение сообщений от клиента
@socketio.on('client-message')
def handle_client_message(message):
    print('message from client:', message)
    # Передача сообщения всем подключенным клиентам
    socketio.emit('server-message', message)

# Обработка отключения пользователя
@socketio.on('disconnect')
def handle_disconnect():
    print('user disconnected')

def login_required(f):
    def wrapper(*args, **kwargs):
        if 'logged_in' not in session:
            flash('Вы должны войти в систему для доступа к этой странице.')
            return redirect(url_for('login_in_dash'))
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__  # Обновляем имя функции
    return wrapper

@app.route('/get_outs')
def get_outs():
    data = HistoryOut.get_all_outs()
    print(data)
    outs = {"history_outs": data}
    return jsonify(outs)


@jwt_required()
@app.route('/get_history_user/<mentor_id>', methods=['GET'])
def get_history_user(mentor_id):
    history = HistoryOut.query.filter_by(mentor_id=mentor_id, ).all()
    history_list = [{'id': i.id,
                     'student_name': i.student.short_name,
                     'data_time_out': i.datetime_out} for i in
                    history]
    return jsonify({'history_list': history_list})
@app.route('/delete_pass', methods=['POST'])
def delete_pass():
    pass_id = request.json['pass_id']
    out = HistoryOut.query.filter_by(id=pass_id).first()
    db.session.delete(out)
    db.session.commit()
    return jsonify({'message':'complite'})



@jwt_required()
@app.route('/fix_out', methods=['POST'])
def fix_out():
    mentor_id = request.json.get('mentor_id')
    student_id = request.json.get('student_id')
    date_out = request.json.get('date_out')
    print(date_out)
    print(student_id)
    date_out_pars = datetime.fromisoformat(date_out)
    print(date_out_pars)
    out = HistoryOut()
    out.student_id = student_id
    out.mentor_id = mentor_id
    out.datetime_out = date_out_pars
    out.datetime_fix = None
    db.session.add(out)
    db.session.commit()
    data = {'message': 'Доюавлено'}
    return jsonify(data)


@jwt_required()
# Роут Логина пользователя
@app.route('/login', methods=['POST'])
def login():
    print
    email = request.json.get('email')
    password = request.json.get('password')
    print(email)
    mentor = Mentor.authenticate(email=email, password=password)
    if mentor:
        return {'user': mentor}
    else:
        return None


@jwt_required()
# Роут Логина пользователя
@app.route('/get_info_mentor/<mentor_id>', methods=['GET'])
def get_info_mentor(mentor_id):
    try:
        mentor = Mentor.query.filter_by(id=mentor_id).first()
        unit_name = Class.query.filter_by(id=mentor.class_id).first()
        unit_list = Student.query.filter_by(class_id=unit_name.id).all()

        list_students = [
            {'id': i.id, 'fullName': i.short_name, 'birthDate': i.birth_date, 'numberPhone': i.phone_number}
            for i in unit_list]

        data = {'className': unit_name.name, 'students': list_students}
        if mentor:
            return jsonify(data)
        else:
            return {'message': ''}
    except:
        return 'Оштбка'



def generate_random_password(length=12):
    """Генерирует случайный пароль заданной длины."""
    # Определяем символы, которые могут быть использованы в пароле
    characters = string.ascii_letters + string.digits + string.punctuation
    # Генерируем пароль
    password = ''.join(random.choice(characters) for _ in range(length))
    return password


@app.route('/upload_all', methods=['GET'])
def upload():
    for i in pars_mentors.get_all_mentors():
        user = User.query.filter_by(email=i['email']).first()
        if user:
            pass
        else:
            characters = string.ascii_letters
            password = ''.join(random.choice(characters) for _ in range(8))
            mentor_id = i.get('id')
            data = pars.get_unit_id(mentor_id)
            teacher_name = i.get('name')
            print(teacher_name)
            phone_number = ''
            klass = Class.query.filter_by(name=data['unit_name']).first()
            if klass:
                pass
            else:
                new_Class = Class()
                new_Class.name = data['unit_name']
                db.session.add(new_Class)
                db.session.commit()
                new_mentor = Mentor()
                new_mentor.register(username=teacher_name, password=password, email=i['email'],
                                    phone_number=phone_number,
                                    class_id=new_Class.id)
                for j in data['list_child']:
                    new_Student = Student()
                    new_Student.short_name = j['short_name']
                    new_Student.phone_number = j['phone_number']
                    new_Student.class_id = new_Class.id
                    db.session.add(new_Student)
                user = User(email=i['email'], password=password, mentor_id=mentor_id)
                db.session.add(user)
                db.session.commit()


@app.route('/register', methods=['POST'])
def register():
    email = request.json.get('email')
    print(email)
    mentor = pars.get_mentor_info(email)
    user = User.query.filter_by(email=email).first()
    if user:
        password = user.password
        x = pars.EmailSender()
        x.send_email(to_email=email, subject='Пароль от учетной записи School1298Out',
                     body=f'Логин:{email}\nПароль:{password}')
        data = {'message': 'Пользователь уже зарегистрирован'}
        return jsonify(data), 200
    else:
        if mentor:
            characters = string.ascii_letters
            password = ''.join(random.choice(characters) for _ in range(8))
            mentor_id = mentor[0].get('id')
            data = pars.get_unit_id(mentor_id)
            teacher_name = mentor[0].get('name')
            phone_number = ''
            klass = Class.query.filter_by(name=data['unit_name']).first()
            if klass:
                return {'message': 'Класс уже зарегистрирован'}
            else:
                new_Class = Class()
                new_Class.name = data['unit_name']
                db.session.add(new_Class)
                db.session.commit()
                new_mentor = Mentor()
                new_mentor.register(username=teacher_name, password=password, email=email, phone_number=phone_number,
                                    class_id=new_Class.id)
                for i in data['list_child']:
                    new_Student = Student()
                    new_Student.short_name = i['short_name']
                    new_Student.phone_number = i['phone_number']
                    new_Student.class_id = new_Class.id
                    db.session.add(new_Student)
                user = User(email=email, password=password, mentor_id=mentor_id)
                db.session.add(user)
                db.session.commit()
                if mentor:
                    x = pars.EmailSender()
                    x.send_email(to_email=email, subject='Пароль от учетной записи School1298Out',
                                 body=password)
                else:
                    print('Не найден')
                data = {'message': 'Ok'}
                return jsonify(data), 200
        else:
            data = {'message': 'Пользователь не найден'}
            return jsonify(data), 404


admin = Admin(app, name='School Admin', template_mode='bootstrap3')
admin.add_view(ClassCustom(Class, db.session))
admin.add_view(StudentCustom(Student, db.session))
admin.add_view(ModelView(Mentor, db.session))
admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(HistoryOut, db.session))
# Инициализация базы данных
with app.app_context():
    db.create_all()  # Создает таблицы
    db.session.commit()

with app.app_context():
    db.create_all()  # Наполняем базу данных

if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
