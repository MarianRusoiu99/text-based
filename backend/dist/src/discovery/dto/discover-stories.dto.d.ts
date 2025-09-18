export declare class DiscoverStoriesDto {
    search?: string;
    category?: string;
    tags?: string[];
    authorId?: string;
    minRating?: number;
    maxRating?: number;
    sortBy?: 'newest' | 'oldest' | 'rating' | 'popular' | 'trending';
    page?: number;
    limit?: number;
}
