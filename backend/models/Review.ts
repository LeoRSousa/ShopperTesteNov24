export class Review{ 
    review_id: number; 
    rating: number; 
    comment: string;
    driver_id: number;

    constructor(review_id: number, rating: number, comment: string, driver_id: number) {
        this.review_id=review_id;
        this.rating=rating;
        this.comment=comment;
        this.driver_id=driver_id;
    }
};