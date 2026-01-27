import express from 'express';
import dotenv from 'dotenv'
import todoRoutes from './routes/todoRoutes';

dotenv.config({ path: '.env' })

const app = express();
app.use(express.json())

app.use("/api/todo", todoRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on PORT ${process.env.PORT}`);
})