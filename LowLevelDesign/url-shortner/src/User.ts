
import { Url } from './Url';
import { AnalyticsConsumer } from './notify/AnalyticsConsumer';

export class User implements AnalyticsConsumer {
    constructor(private id: string, private name: string) {}

    public getId() {
        return this.id;
    }

    public onExpiry(url: Url) {
        console.log(`${url.getLongUrl()} has expired`)
    }
}