export declare class RateStoryDto {
    rating: number;
    review?: string;
}
export declare class AddCommentDto {
    content: string;
    parentCommentId?: string;
}
export declare class GetPaginatedDto {
    page?: number;
    limit?: number;
}
