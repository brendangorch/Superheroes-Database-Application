import React from 'react';
import axios from 'axios';

// create the btns for hiding/unhiding a review
const HideReviewsBtn = ( {verificationToken, list, review}) => {
  // function for when hide is clicked
  const onHideClick = async () => {
    try {
        // make call to backend function for hiding a review
        const res = await axios.post('/api/admin/hidereview', {
            adminToken: verificationToken,
            listName: list.list_name,
            reviewNumber: review.review_num
        });

        alert(res.data.message)

    } catch (error) {
        console.log("Error:", error)
    }

  };
  // function for when unhide is clicked
  const onUnhideClick = async () => {
    try {
        // make call to backend function for unhiding a review
        const res = await axios.post('/api/admin/unhidereview', {
            adminToken: verificationToken,
            listName: list.list_name,
            reviewNumber: review.review_num
        });

        alert(res.data.message);

    } catch (error) {
        console.log("Error:", error)
    }
  };

  return (
    <div className='div'>
        <button className='button' onClick={onHideClick}>Hide Review</button>
        <button className='button' onClick={onUnhideClick}>Unhide Review</button>
    </div>
  );
};

export default HideReviewsBtn;