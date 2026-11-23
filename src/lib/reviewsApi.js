const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://eualvpxtqjcjicfbdgbe.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_IjBWlnZFNPqV5RTDyhL7fw_Zjj5GrBD";

const REVIEWS_ENDPOINT = `${SUPABASE_URL}/rest/v1/portfolio_reviews`;

export async function fetchCustomerReviews() {
  const url = `${REVIEWS_ENDPOINT}?select=id,name,rating,review,created_at&order=created_at.desc`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let detail = "Failed to load reviews.";
    try {
      const errData = await response.json();
      if (errData?.message) detail = errData.message;
    } catch {
      // Keep default error message
    }
    throw new Error(detail);
  }

  return response.json();
}

export async function submitCustomerReview({ name, email, rating, review }) {
  const response = await fetch(REVIEWS_ENDPOINT, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      rating: Number(rating),
      review: review.trim(),
    }),
  });

  if (!response.ok) {
    let detail = "Failed to save your review. Please try again.";
    try {
      const errData = await response.json();
      if (errData?.message) detail = errData.message;
    } catch {
      // Keep default error message
    }
    throw new Error(detail);
  }
}
