import { CounterBasedUrlGenerationStrategy } from "./strategy/CounterBasedUrlGenerationStrategy";
import { UrlGenerationStrategy } from "./strategy/UrlGenerationStrategy";
import { Url, UrlStatus } from "./Url";
import { User } from "./User";
import { UserService } from "./UserService";

class UrlShortner {
    private static instance: UrlShortner;
    private urls: Map<string, Url>
    private userService = UserService.getInstance();
    private urlGenerationStrategy: UrlGenerationStrategy;
    private constructor() {
        this.urls = new Map();
        this.urlGenerationStrategy = new CounterBasedUrlGenerationStrategy();
    }

    public static getInstance(): UrlShortner {
        if (!UrlShortner.instance) {
            UrlShortner.instance = new UrlShortner()
        }
        return UrlShortner.instance
    }

    public generateShortUrl(userId: any, originalUrl: string, customAlias?: string, expiryTime?: Date): Url {
        const user = this.userService.getUser(userId);
        if (!user) {
            throw new Error("Invalid User");
        }

        if (customAlias && this.urls.has(customAlias)) {
            throw new Error("Given Custom Alias already exists!");
        }
        
        let shortUrl = customAlias || this.urlGenerationStrategy.generateShortUrl();
        while (this.urls.has(shortUrl)) {
            // Collision occurred, generate a new short URL
            // This is a rare case and can be optimized further
            shortUrl = this.urlGenerationStrategy.generateShortUrl();
        }
            
        const url = new Url(shortUrl, originalUrl, user, expiryTime);
        this.urls.set(url.getShortUrl(), url);
        url.getAnalyticsProducer().registerObserver(user);
        return url;
    }

    public getOriginalUrl(shortUrl: string): string {
        // if (!(this.urls.has(shortUrl))) {
        //     throw new Error("Invalid Short URL");
        // }

        const url = this.urls.get(shortUrl);
        if (!url || !url.isActive()) {
            throw new Error("Invalid Short URL");
        }

        return url.getLongUrl();
    }

    setUrlGenerationStrategy(strategy: UrlGenerationStrategy) {
        this.urlGenerationStrategy = strategy;
    }
}