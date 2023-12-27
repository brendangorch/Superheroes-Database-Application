import React from 'react';
import { useState } from 'react';
import HideReviewsBtn from './HideReviewBtn';

// create the btn for displaying a list's reviews
const DisplayListReviewsBtn = ({list, verificationToken}) => {
    const [displayReviews, setDisplayReviews] = useState(false);


    const onDisplayClick = () => {
        setDisplayReviews(!displayReviews);
    };

    // function to hide review
    const hideReview = async () => {
        try {
            alert(verificationToken)
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // function to unhide review
    const unhideReview = async () => {
        try {

        } catch (error) {
            console.log("Error:", error);
        }
    };
        
    return (
        <div className='div'>
      <button className='button' type='submit' onClick={onDisplayClick}>
        {displayReviews ? 'Hide Reviews' : 'Display Reviews'}
      </button>

      {/* Render the fetched reviews */}
      {displayReviews && (
        <div>
          <h2>Reviews:</h2>
          {list.reviews.length > 0 ? (
            list.reviews.map((review, index) => (
               (
                <div key={index}>
                  <p><b>Rating:</b> {review.rating}</p>
                  <p><b>Comment:</b> {review.comment}</p>
                  <p><b>Created By:</b> {review.created_by}</p>
                  <p><b>Date Created:</b> {review.date_created}</p>
                  <p><b>Hidden:</b> {review.hidden ? 'True' : 'False'}</p>
                  <HideReviewsBtn verificationToken={verificationToken} list={list} review={review}></HideReviewsBtn>
                </div>
              )
            ))
          ) : (
            <p>No reviews exist.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayListReviewsBtn;