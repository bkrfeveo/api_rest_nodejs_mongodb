import { v4 as uuidv4 } from 'uuid';

export default uuidv4();

export let tasks = [
    {
        "id": uuidv4(),
        "username": "Abdou",
        "title": "Faire les courses",
        "description": "Acheter du pain et du lait",
        "completed": true,
        "priority": "high",
        "dueDate": "2025-10-25",
        "createdAt": "2025-10-21T10:00:00Z"
    },
    {
        "id": uuidv4(),
        "username": "fadel",
        "title": "Rendre visite mes amis",
        "description": "L'apres midi à 16h. Rendre visite Modou pour discuter avec lui",
        "completed": false,
        "priority": "lower",
        "dueDate": "2025-10-29",
        "createdAt": "2025-10-29T16:00:00Z"
    },
    {
        "id": uuidv4(),
        "username": "sokhna",
        "title": "Faire de la natation",
        "description": "Je dois me preparer a l'examen de natation qui sera dans une semaine.",
        "completed": false,
        "priority": "medium",
        "dueDate": "2025-10-31",
        "createdAt": "2025-10-21T10:00:00Z"
    },
]