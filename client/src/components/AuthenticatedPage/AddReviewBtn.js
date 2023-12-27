import React, {useState} from 'react';
import axios from 'axios';

// create the btn for creating a new list
const AddReviewBtn = ({ list, username }) => {
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    // prevent special characters from being entered
    const validateKeyPress = (event) => {
      const regex = /^[a-zA-Z0-9\s\-!.,?/() ]*$/;
      if (!regex.test(event.key)) {
          event.preventDefault();
      }
    };

    // function called to display form and confirm button
    const onAddReviewClick = () => {
        setIsAddingReview(true);
    };

    // when confirm is clicked
    const onConfirmClick = async () => {

        if (rating) {
            try {
                // call backend add review function
                const res = await axios.post('/api/secure/addreviewtolist', {
                  listName: list.list_name,
                  reviewRating: rating,
                  reviewComment: comment,
                  username: username
                });
          
                alert(res.data.message);
          
                // reset state after adding the review
                setIsAddingReview(false);
                setRating(0);
                setComment('');
              } catch (error) {
                console.log('Error:', error);
              }
        } else {
            alert("Please enter a rating.");
        }
        
      };
    
    return (
        <div className='div'>
        {!isAddingReview ? (
          <button onClick={onAddReviewClick}>Add Review</button>
        ) : (
          <div>
            <label>Rating:</label>
            <input
                type='number'
                value={rating}
                onChange={(e) => setRating(Math.min(10, Math.max(1, e.target.value)))}
                min="1"
                max="10"
            />
  
            <label>Comment:</label>
            <input
              type='text'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={validateKeyPress}
            />
  
            <button onClick={onConfirmClick}>Confirm</button>
          </div>
        )}
      </div>
    );
};

export default AddReviewBtn;