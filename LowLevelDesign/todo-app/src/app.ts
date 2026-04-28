import express from 'express';
import dotenv from 'dotenv'
import todoRoutes from './routes/todoRoutes';

dotenv.config({ path: '.env' })

const app = express();
app.use(express.json())

app.use("/api/todo", todoRoutes)

app.use((err, req, res, next) => {
    if(err.name === "ValidationError") {
        return res.status(400).json({ message: err.message, errors: err.errors })
    }
    console.error('Internal server error:', err);
    return res.status(500).json({ message: "Internal server error", error: err.message })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on PORT ${process.env.PORT}`);
})