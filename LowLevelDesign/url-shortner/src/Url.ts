import { AnalyticsProducer } from "./notify/AnalyticsProducer";
import { User } from "./User";

export enum UrlStatus {
    ACTIVE,
    INACTIVE
}

export class Url {
    private status: UrlStatus;
    private analyticsProducer: AnalyticsProducer;
    // private shortUrl: string;
    private longUrl: string;
    private creator: User;
    private expiryTime?: Date;

    constructor(
        private shortUrl: string,
        longUrl: string,
        creator: User,
        expiryTime?: Date,
    ) {
        // this.shortUrl = shortUrl;
        this.longUrl = longUrl;
        this.creator = creator;
        this.expiryTime = expiryTime;
        this.status = UrlStatus.ACTIVE;
        this.analyticsProducer = new AnalyticsProducer();
    }

    public getCreator(): User {
        return this.creator;
    }

    public isActive(): boolean {
        return this.status == UrlStatus.ACTIVE && (!this.expiryTime || this.expiryTime > new Date());
    }

    public getShortUrl(): string {
        return this.shortUrl;
    }

    public getLongUrl(): string {
        return this.longUrl;
    }

    public getAnalyticsProducer(): AnalyticsProducer {
        return this.analyticsProducer;
    }

    public expire() {
        this.status = UrlStatus.INACTIVE;
        this.analyticsProducer.notifyObservers(this);
    }
}