import { object, string, number, date, boolean } from 'yup';

let todoSchema = object({
    title: string().required(),
    description: string(),
    completed: boolean().default(false),
    created_at: date().default(() => new Date()),
    updated_at: date().default(() => new Date())

})

export default todoSchema;