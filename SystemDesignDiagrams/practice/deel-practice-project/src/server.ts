import { app } from './app.js';
import { sequelize, connectDB } from './config/database.js';

const PORT = process.env.PORT || 3000;

(async () => {
    await connectDB();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
})();
