

import requests

url = "https://school.mos.ru/api/ej/core/teacher/v1/teacher_profiles"
params = {
    "academic_year_id": "12",
    "school_id": "28"
}

headers = {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "aid": "12",
    "authorization": "Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyMzQxMjEiLCJzY3AiOiJvcGVuaWQgcHJvZmlsZSIsInN0ZiI6IjMzMzA0NDE3IiwiaXNzIjoiaHR0cHM6XC9cL3NjaG9vbC5tb3MucnUiLCJyb2wiOiIiLCJzc28iOiI4YzIzYWQ3ZS0xNGU0LTQ0YzYtYmVjZC05MmRjYjk4ZjkzNmQiLCJhdWQiOiI5OjkiLCJuYmYiOjE3Mjg5NzA0NjUsImF0aCI6InN1ZGlyIiwicmxzIjoiezE5Ols0OTY6MTY6W11dfSx7OTpbNDM6MTpbNTI5XSw1MDo5Ols1MjldLDU0Ojk6WzUyOV0sMTM2OjQ6WzUyOV0sMTgxOjE2Ols1MjldLDE4NDoxNjpbNTI5XSwyMDI6MTc6WzUyOV0sNDAwOjMwOls1MjldLDUyOTo0NDpbNTI5XSw1MzU6NDg6WzUyOV1dfSIsImV4cCI6MTcyOTgzNDQ2NSwiaWF0IjoxNzI4OTcwNDY1LCJqdGkiOiI0NTMxOTNhYy1mODYyLTQ2ZTUtYjE5My1hY2Y4NjJiNmU1MGQifQ.nQ807JFNVWvtETsKxgYaXs6tO4ft8OQqVjBwCuJG814NxxpJxVgmH7hdS8v0xwAPaULCu_YrCW6XaFZbRpBwHeibL-OY1Yvoua_lg7e4ceBmB35r85Gl0ZNd-fuB7AXJf87L_HwmoDKgfk2mJhqZ1h-SiGT8xEQiL89OExCye7yssAiPzwqEJLxrxStvP28yBe3rhmSAVirP_ETA-6smJQSQ30rnZRPbjqQPZJFNzPiWQGXqNC-T5aozHZJ6Y2B4X91e6EKAMGM1okIgL0k3_znvw4Tg_RBEAXmJoqutRWpEqmncTVsclMhW0nJKtZyCfzujL_S9UPjA-r0IH7TGgQ",
    "priority": "u=1, i",
    "profile-id": "16073051",
    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-mes-hostid": "9",
    "x-mes-subsystem": "teacherweb"
}
def get_all_mentors():
    response = requests.get(url="https://school.mos.ru/api/ej/core/teacher/v1/teacher_profiles", headers=headers, params=params)
    teachers = []
    for i in range(1, 7):
        url = f'https://school.mos.ru/api/ej/core/teacher/v1/teacher_profiles?page={i}'
        data = requests.get(url, headers=headers).json()

        for y in data:

            if y.get('user'):
                if y.get('user').get('email'):
                    if y['managed_class_unit_ids']:
                        teachers.append({'id': y['id'], 'email': y['user']['email'], 'name': y['name']})
    print(teachers)
    return teachers

