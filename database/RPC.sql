CREATE OR REPLACE FUNCTION increment_assessments_taken(p_user_id uuid, p_timestamp timestamp with time zone)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET 
    assessments_taken = assessments_taken + 1,
    last_assessment_date = p_timestamp,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;