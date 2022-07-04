import React from "react";
import { useState } from "react"
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from "react-router-dom";
import { createReview, deleteReviews } from "../../store/business";
import './review.css';

function Review() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { businessId } = useParams()
  const userId = useSelector((state) => state.session.user.id)
  const businesses = useSelector((state) => state.business)
  const business = businesses[businessId]
  const reviews = business.Reviews

  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [showReviewForm, setShowReviewForm] = useState("hide-review-form")
  const [reviewTotal, setReviewTotal] = useState(0)

  const updateRating = (e) => setRating(e.target.value)
  const updateReview = (e) => setReview(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      userId: userId,
      businessId: businessId,
      rating,
      review
    }

    const createdReview = await dispatch(createReview(payload))
    if (createdReview) {
      console.log(reviews)
      let reviewNums = reviews.map(obj => obj.rating)
      console.log(reviewNums)
      setReviewTotal((reviewNums.reduce((a, b) => a + b)) / (reviewNums.length))
      console.log(reviewTotal)
      history.push(`/business/${businessId}`)
    }
  }

  function handleDelete(id) {
    dispatch(deleteReviews(id, businessId))
    history.push(`/business/${businessId}`)
  }

  const handleClick = (e) => {
    e.preventDefault()
    setShowReviewForm("review-form")
  }

  const handleCancelClick = (e) => {
    e.preventDefault()
    setShowReviewForm("hide-review-form")
  }


  return (
    <div className="review">
      {/* {reviews} */}
      <p>{Math.round(reviewTotal)}</p>
      {reviews?.map(({ id, rating, review }) => (
        <div key={id} className="reviewCard">
          <h1>{rating}</h1>
          <h1>{review}</h1>
          <button onClick={(e) => { e.preventDefault(); handleDelete(id) }}>Delete review</button>
        </div>
      ))}
      <button onClick={handleClick}>Leave a review</button>
      <div className={showReviewForm}>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="rating"
            required
            value={rating}
            onChange={updateRating} />
          <input
            type="text"
            placeholder="review"
            value={review}
            onChange={updateReview} />
          <button type="submit">Submit review</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default Review
