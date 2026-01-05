import app from './app.js';
import { NotificationWorker } from './notification.worker.js';
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server running on PORT 3000');
    NotificationWorker.process();
})

